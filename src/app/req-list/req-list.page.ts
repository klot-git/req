import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {CdkDragDrop, CdkDragEnd, CdkDragStart, DropListRef, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { Requirement } from '../requirement';
import { MessageService } from '../services/message.service';
import { ProjectService } from '../services/project.service';
import { ReqService } from '../services/req.service';
import { Router } from '@angular/router';
import { EventAggregatorService } from '../services/event-aggregator.service';

@Component({
  selector: 'app-req-list',
  templateUrl: './req-list.page.html',
  styleUrls: ['./req-list.page.scss'],
})
export class ReqListPage implements OnInit {

  form: FormGroup;

  epics: Requirement[] = [];

  selectedEpic: Requirement = null;

  selectedReq: Requirement = null;

  isDraggingEpic = false;

  @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === 'ArrowDown') {
      this.moveSelectedReqDown();
    }
  }

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private events: EventAggregatorService,
    private messageService: MessageService,
    private reqService: ReqService,
    private projectService: ProjectService
  ) {
    this.form = new FormGroup({
      newRequirement: new FormControl('')
    });
    events.subscribe('REQ-CHANGED', req => {
      const myReq = this.findEpicOrStory(req.reqId);
      if (!myReq) {
        return;
      }
      myReq.name = req.name;
      myReq.reqCode = req.reqCode;
    });
  }

  ngOnInit() {
    this.loadRequirements();
  }

  async loadRequirements() {
    const reqs = await this.reqService.loadRequirements();
    this.epics = this.reqService.groupRequirementsIntoEpics(reqs);
  }

  selectEpic(epic: Requirement) {
    // if (this.selectedEpic === epic) {
    //   this.selectedEpic = null;
    // } else {
    //   this.selectedEpic = epic;
    // }
    this.selectedEpic = epic;
    setTimeout(() => {
      if (epic === null) {
        return;
      }
      const f = window.document.getElementById('add-field-' + epic.reqId) as any;
      f.setFocus();
    }, 100);
  }

  selectReq(req: Requirement) {
    this.selectedReq = req;
  }

  moveSelectedReqDown() {
    if (!this.selectedReq) {
      return;
    }

    // if its an epic with no childs, go to the next epic
    if (this.selectedReq.parentId === 0 && (!this.selectedReq.childs || this.selectedReq.childs.length === 0)) {
      const idx = this.epics.indexOf(this.selectedReq);
      if (idx < this.epics.length - 1) {
        this.selectReq(this.epics[idx + 1]);
      }
      return;
    }

    // if its an epic with no childs, go to the next epic
    if (this.selectedReq.parentId === 0 && this.selectedReq.childs && this.selectedReq.childs.length > 0) {
      this.selectReq(this.selectedReq.childs[0]);
      return;
    }

    // if its an story
    if (this.selectedReq.parentId !== 0) {
      const parent = this.epics.find(e => e.reqId === this.selectedReq.parentId);
      if (!parent) {
        return;
      }
      const idx = parent.childs.indexOf(this.selectedReq);
      if (idx < parent.childs.length - 1) {
        this.selectReq(parent.childs[idx + 1]);
        return;
      }

      const parentIdx = this.epics.indexOf(parent);
      if (parentIdx < this.epics.length - 1) {
        this.selectReq(this.epics[parentIdx + 1]);
      }
      return;
    }

  }

  addRequirement() {

    if (!this.form.get('newRequirement').value) {
      return;
    }

    let collection = this.epics;
    if (this.selectedEpic) {
      if (!this.selectedEpic.childs) {
        this.selectedEpic.childs = [];
      }
      collection = this.selectedEpic.childs;
    }

    const req = new Requirement();
    req.name = this.form.get('newRequirement').value;
    req.projectId = this.projectService.currentProjectId;

    req.order = collection.length;
    req.parentId = this.selectedEpic ? this.selectedEpic.reqId : 0;
    req.reqCode = 'USR-' + ('000' + (req.order + 1)).substr(-3, 3);

    collection.push(req);
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
    const idx = this.epics.findIndex(r => r.reqId === req.reqId);
    this.epics.splice(idx, 1);

    // update other epics order
    this.epics.filter(r => r.order >= req.order).forEach(r => { r.order--; });

    // add it to the parent childs
    const oldOrder = req.order;
    req.order = parent.childs.length;
    req.parentId = parent.reqId;
    parent.childs.push(req);

    // update req parent at db
    this.reqService.updateRequirementParent(req.reqId, req.parentId, req.order);

    // update epics order at db
    this.reqService.shiftRequirementsOrder(0, oldOrder, -1);

    console.log(this.epics);

  }

  toEpic(req: Requirement) {

    // finds the parent
    const parent = this.epics.find(r => r.reqId === req.parentId);
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
    req.order = this.epics.length;
    this.epics.push(req);

    // update req parent at db
    this.reqService.updateRequirementParent(req.reqId, req.parentId, req.order);

    // update childs order at db
    this.reqService.shiftRequirementsOrder(parent.reqId, oldOrder, -1);

    console.log(this.epics);

  }

  async onDrop(event: CdkDragDrop<string[]>, reqs: Requirement[]) {

    this.isDraggingEpic = false;

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
    const reqIdx = this.epics.indexOf(req);
    if (reqIdx <= 0 ) {
      return null;
    }
    const previousReq = this.epics[reqIdx - 1];

    if (!previousReq.parentId) {
      return previousReq;
    } else {
      return this.epics.find(r => r.reqId === previousReq.parentId);
    }
  }

  showReqDetail(req: Requirement) {
    this.router.navigate(['/requirements/' + req.reqId]);
  }

  onEpicDragStart(e) {
    this.isDraggingEpic = true;
    this.cdr.detectChanges();
    console.log('repaint');
  }

  private findEpicOrStory(reqId: number): Requirement {
    for (const e of this.epics) {
      if (e.reqId === reqId) {
        return e;
      }
      for (const s of e.childs) {
        if (s.reqId === reqId) {
          return s;
        }
      }
    }
    return null;
  }


}
