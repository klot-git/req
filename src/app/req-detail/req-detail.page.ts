import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Requirement, RequirementData } from '../requirement';
import { ReqService } from '../services/req.service';

@Component({
  selector: 'app-req-detail',
  templateUrl: './req-detail.page.html',
  styleUrls: ['./req-detail.page.scss'],
})
export class ReqDetailPage implements OnInit {

  // https://github.com/KillerCodeMonkey/ngx-quill

  form: FormGroup;

  req: Requirement;

  constructor(
    private reqService: ReqService,
    private route: ActivatedRoute) {

    this.req = { reqId: parseInt(this.route.snapshot.paramMap.get('id'), 10), data: new RequirementData() } as Requirement;

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
    this.bindToObject();
    this.reqService.updateRequirement(this.req);
  }

}
