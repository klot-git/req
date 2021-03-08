import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Requirement, RequirementData } from '../requirement';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { ReqService } from '../services/req.service';
import { FileService } from '../services/file.service';
import { BaseProjectPage } from '../base-project.page';

@Component({
  selector: 'app-req-detail',
  templateUrl: './req-detail.page.html',
  styleUrls: ['./req-detail.page.scss'],
})
export class ReqDetailPage extends BaseProjectPage implements OnInit {

  // https://github.com/KillerCodeMonkey/ngx-quill

  form: FormGroup;

  req: Requirement;

  private cancelEdit = false;

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
      this.cancelEdit = true;
      this.location.back();
      break;
    }
  }

  constructor(
    route: ActivatedRoute,
    fileService: FileService,
    private location: Location,
    private events: EventAggregatorService,
    private reqService: ReqService) {

    super(route, fileService);

    this.req = { reqId: this.route.snapshot.paramMap.get('reqId'), data: new RequirementData() } as Requirement;

    this.form = new FormGroup({
      name: new FormControl(''),
      reqCode: new FormControl(''),
      story: new FormControl('')
    });
  }

  ngOnInit() {
    this.load();
  }

  private bindToScreen() {
    this.form.get('name').setValue(this.req.name);
    this.form.get('reqCode').setValue(this.req.reqCode);
    this.form.get('story').setValue(this.req.data.story);
  }

  private bindToObject() {
    this.req.name = this.form.get('name').value;
    this.req.reqCode = this.form.get('reqCode').value;
    this.req.data.story = this.form.get('story').value;
  }

  async load() {
    this.req = await this.reqService.loadRequirement(this.req.reqId);
    if (!this.req.data) {
      this.req.data = new RequirementData();
    }
    this.bindToScreen();
  }

  ionViewWillLeave() {
    if (this.cancelEdit) {
      return;
    }
    this.bindToObject();
    this.reqService.updateRequirement(this.req);
    this.events.publish('REQ-CHANGED', this.req);
  }

}
