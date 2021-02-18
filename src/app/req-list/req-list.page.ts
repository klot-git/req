import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ItemReorderEventDetail } from '@ionic/core';

import {CdkDragDrop, CdkDragEnd, CdkDragStart, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

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
    const reqs = await this.reqService.loadRequirements();

    console.log(reqs);

    this.requirements = this.reqService.groupRequirements(reqs);

    console.log(this.requirements);
  }

  addRequirement() {
    if (!this.form.get('newRequirement').value) {
      return;
    }

    const req = new Requirement();
    req.name = this.form.get('newRequirement').value;
    req.projectId = this.projectService.currentProjectId;

    req.order = this.requirements.length;
    req.reqCode = 'USR-' + ('000' + (req.order + 1)).substr(-3, 3);

    req.parentId = 0;

    this.requirements.push(req);
    this.form.get('newRequirement').setValue('');
    this.reqService.createRequirement(req);
  }

  toStory(req: Requirement) {

    // find the new parent
    const parent = this.findNewParentFor(req);
    if (!parent) {
      return;
    }
    if (!parent.childs) {
      parent.childs = [];
    }

    // remove it from the epics collection
    const idx = this.requirements.findIndex(r => r.reqId === req.reqId);
    this.requirements.splice(idx, 1);

    // update other epics order
    this.requirements.filter(r => r.order >= req.order).forEach(r => { r.order--; });

    // add it to the parent childs
    const oldOrder = req.order;
    req.order = parent.childs.length;
    req.parentId = parent.reqId;
    parent.childs.push(req);

    // update req parent at db
    this.reqService.updateRequirementParent(req.reqId, req.parentId, req.order);

    // update epics order at db
    this.reqService.shiftRequirementsOrder(0, oldOrder, -1);

    console.log(this.requirements);

  }

  toEpic(req: Requirement) {

    // finds the parent
    const parent = this.requirements.find(r => r.reqId === req.parentId);
    if (!parent) {
      return;
    }

    // remove it from the parent childs
    const idx = parent.childs.findIndex(r => r.reqId === req.reqId);
    parent.childs.splice(idx, 1);

    // update other childs order
    parent.childs.filter(r => r.order >= req.order).forEach(r => { r.order--; });

    // adds it to the epic collection
    req.parentId = 0;
    const oldOrder = req.order;
    req.order = this.requirements.length;
    this.requirements.push(req);

    // update req parent at db
    this.reqService.updateRequirementParent(req.reqId, req.parentId, req.order);

    // update childs order at db
    this.reqService.shiftRequirementsOrder(parent.reqId, oldOrder, -1);

    console.log(this.requirements);

  }

  async onDrop(event: CdkDragDrop<string[]>, reqs: Requirement[]) {

    const req = reqs[event.previousIndex];

    console.log('id do req:' + req.reqId);
    console.log('form:' + event.previousIndex + ' to:' + event.currentIndex);

    // reorder items at the array
    moveItemInArray(reqs, event.previousIndex, event.currentIndex);

    // updat order field
    const startIdx = event.previousIndex <= event.currentIndex ? event.previousIndex : event.currentIndex;
    const endIdx = event.previousIndex > event.currentIndex ? event.previousIndex : event.currentIndex;
    for (let i = startIdx; i <= endIdx; i++) {
      reqs[i].order = i;
    }

    console.log(reqs);

    try {
      await this.reqService.updateRequirementsOrder(req.reqId, req.parentId, event.previousIndex, event.currentIndex);
    } catch (err) {
      this.messageService.addError('Sorry, could not reorder items');
      console.log(err);
    }
  }


  private findNewParentFor(req: Requirement): Requirement {
    const reqIdx = this.requirements.indexOf(req);
    if (reqIdx <= 0 ) {
      return null;
    }
    const previousReq = this.requirements[reqIdx - 1];

    if (!previousReq.parentId) {
      return previousReq;
    } else {
      return this.requirements.find(r => r.reqId === previousReq.parentId);
    }
  }



}
