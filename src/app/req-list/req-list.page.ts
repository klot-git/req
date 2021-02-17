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

  movingEpics = false;

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

  async onDrop(event: CdkDragDrop<string[]>) {

    this.movingEpics = false;

    const req = this.requirements[event.previousIndex];

    console.log('id do req:' + req.reqId);
    console.log('form:' + event.previousIndex + ' to:' + event.currentIndex);

    // reorder items at the array
    moveItemInArray(this.requirements, event.previousIndex, event.currentIndex);

    // updat order field
    const startIdx = event.previousIndex <= event.currentIndex ? event.previousIndex : event.currentIndex;
    const endIdx = event.previousIndex > event.currentIndex ? event.previousIndex : event.currentIndex;
    for (let i = startIdx; i <= endIdx; i++) {
      this.requirements[i].order = i;
    }

    console.log(this.requirements);

    try {
      await this.reqService.updateRequirementsOrder(req.reqId, event.previousIndex, event.currentIndex);
    } catch (err) {
      this.messageService.addError('Sorry, could not reorder items');
      console.log(err);
    }
  }

  onDragEnded(event: CdkDragEnd): void {
    // event.source._dragRef.reset();
  }

  onDragStart(event: CdkDragStart): void {
    // console.log(event.source._dragRef);
    this.movingEpics = true;

  }

  toStory(req: Requirement) {
    const parentId = this.findNewParentIdFor(req);
    if (!parentId) {
      return;
    }
    req.parentId = parentId;
  }

  toEpic(req: Requirement) {
    req.parentId = null;
  }

  private findNewParentIdFor(req: Requirement): number {
    const reqIdx = this.requirements.indexOf(req);
    if (reqIdx <= 0 ) {
      return null;
    }
    const previousReq = this.requirements[reqIdx - 1];

    if (!previousReq.parentId) {
      return previousReq.reqId;
    } else {
      return previousReq.parentId;
    }

  }


}
