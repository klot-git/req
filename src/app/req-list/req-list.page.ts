import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ItemReorderEventDetail } from '@ionic/core';

import { Requirement } from '../requirement';
import { MessageService } from '../services/message.service';
import { ProjectService } from '../services/project.service';
import { ReqService } from '../services/req.service';

@Component({
  selector: 'app-req-list',
  templateUrl: './req-list.page.html',
  styleUrls: ['./req-list.page.scss'],
})
export class ReqListPage implements OnInit {

  form: FormGroup;

  requirements: Requirement[] = [];

  constructor(
    private messageService: MessageService,
    private reqService: ReqService,
    private projectService: ProjectService
  ) {
    this.form = new FormGroup({
      newRequirement: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadRequirements();
  }

  async loadRequirements() {
    this.requirements = await this.reqService.loadRequirements();
    // console.log(this.requirements);
  }

  addRequirement() {
    if (!this.form.get('newRequirement').value) {
      return;
    }

    const req = new Requirement();
    req.name = this.form.get('newRequirement').value;
    req.projectId = this.projectService.currentProjectId;

    if (this.requirements.length === 0) {
      req.order = 0;
    } else {
      req.order = this.requirements.length;
    }
    req.reqCode = 'USR-' + (req.order + 1);

    this.requirements.push(req);
    this.form.get('newRequirement').setValue('');
    this.reqService.createRequirement(req);
  }

  async doReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    const reqId = this.requirements[ev.detail.from].reqId;

    // console.log('id do req:' + reqId);
    // console.log('form:' + ev.detail.from + ' to:' + ev.detail.to);

    // update items with new order
    this.requirements = ev.detail.complete(this.requirements);

    const startIdx = ev.detail.from <= ev.detail.to ? ev.detail.from : ev.detail.to;
    const endIdx = ev.detail.from > ev.detail.to ? ev.detail.from : ev.detail.to;
    for (let i = startIdx; i <= endIdx; i++) {
      this.requirements[i].order = i;
    }

    // console.log(this.requirements);

    try {
      await this.reqService.updateRequirementsOrder(reqId, ev.detail.from, ev.detail.to);
    } catch (err) {
      this.messageService.addError('Sorry, could not reorder items');
      console.log(err);
    }
  }


}
