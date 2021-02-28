import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {CdkDragDrop, CdkDragEnd, CdkDragStart, DropListRef, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { v4 as uuidv4} from 'uuid';

import { Requirement } from '../requirement';
import { MessageService } from '../services/message.service';
import { ProjectService } from '../services/project.service';
import { ReqService } from '../services/req.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { BaseProjectPage } from '../base-project.page';


@Component({
  selector: 'app-req-list',
  templateUrl: './req-list.page.html',
  styleUrls: ['./req-list.page.scss'],
})
export class ReqListPage extends BaseProjectPage implements OnInit {

  form: FormGroup;

  epics: Requirement[] = [];

  insertingReq = false;

  selectedReq: Requirement = null;

  isDraggingEpic = false;

  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    // console.log(event);
    switch (event.key) {
      case 'Insert':
      this.insertNewRequirement();
      break;
      case 'Delete':
      this.removeRequirement();
      break;
      case 'Enter':
      if (this.selectedReq) {
        this.showReqDetail(this.selectedReq);
      }
      break;
      case 'ArrowRight':
      if (this.insertingReq) {
        return;
      }
      this.toStory(this.selectedReq);
      break;
      case 'ArrowLeft':
      if (this.insertingReq) {
        return;
      }
      this.toEpic(this.selectedReq);
      break;
      case 'ArrowDown':
      this.moveSelectedReqDown();
      break;
      case 'ArrowUp':
      this.moveSelectedReqUp();
      break;
    }
  }

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService,
    events: EventAggregatorService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private reqService: ReqService) {

    super(route, projectService);

    this.form = new FormGroup({
      newRequirement: new FormControl('')
    });
    events.subscribe('REQ-CHANGED', req => {
      const myReq = this.findRequirement(req.reqId);
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
    const reqs = await this.reqService.loadRequirements(this.projectId);
    this.epics = this.reqService.groupRequirementsIntoEpics(reqs);
    console.log(this.epics);
  }

  insertNewRequirement() {
    this.insertingReq = true;
    setTimeout(() => {
      if (this.selectedReq === null) {
        return;
      }
      const f = window.document.getElementById('add-field-' + this.selectedReq.reqId) as any;
      if (f) { f.setFocus(); }
    }, 100);
  }

  cancelInsertNewRequirement() {
    this.insertingReq = false;
    this.form.get('newRequirement').setValue('');
  }

  selectReq(req: Requirement) {
    if (this.selectedReq === req) {
      this.selectedReq = null;
    } else {
      this.selectedReq = req;
    }
    this.insertingReq = false;
  }

  /**
   * Moves the selected requirement down.
   */
  moveSelectedReqDown() {
    if (!this.selectedReq) {
      return;
    }

    // if its an epic with no childs, go to the next epic
    if (this.selectedReq.parentId === '0' && (!this.selectedReq.childs || this.selectedReq.childs.length === 0)) {
      const idx = this.epics.indexOf(this.selectedReq);
      if (idx < this.epics.length - 1) {
        this.selectReq(this.epics[idx + 1]);
      }
      return;
    }

    // if its an epic with childs, go to the first child
    if (this.selectedReq.parentId === '0' && this.selectedReq.childs && this.selectedReq.childs.length > 0) {
      this.selectReq(this.selectedReq.childs[0]);
      return;
    }

    // if its an story
    if (this.selectedReq.parentId !== '0') {
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

  /**
   * Moves the selected requirement up.
   */
  moveSelectedReqUp() {
    if (!this.selectedReq) {
      return;
    }

    // if its an epic
    if (this.selectedReq.parentId === '0') {
      const idx = this.epics.indexOf(this.selectedReq);
      if (idx === 0) {
        return;
      }
      // if the previous epic has no childs
      const previousEpic = this.epics[idx - 1];
      if (!previousEpic.childs || previousEpic.childs.length === 0) {
        this.selectReq(previousEpic);
        return;
      }
      // if the previous epic has childs
      this.selectReq(previousEpic.childs[previousEpic.childs.length - 1]);
      return;
    }

    // if its a story
    if (this.selectedReq.parentId !== '0') {
      const parent = this.epics.find(e => e.reqId === this.selectedReq.parentId);
      const idx = parent.childs.indexOf(this.selectedReq);

      // if is not the first child
      if (idx >= 1) {
        this.selectReq(parent.childs[idx - 1]);
        return;
      }

      // if is the first child, move to the parent
      this.selectReq(parent);

    }

  }

  /**
   * Adds a new requirement.
   * @param event The keyboard event that fires the action
   */
  addRequirement(event: KeyboardEvent = null) {

    if (event) {
      event.preventDefault();
      event.cancelBubble = true;
    }

    if (!this.form.get('newRequirement').value) {
      return false;
    }

    let collection = this.epics;
    let insertIdx = this.epics.length;
    if (this.selectedReq && this.selectedReq.parentId !== '0') {
      const parent = this.epics.find(e => e.reqId === this.selectedReq.parentId);
      if (!parent.childs) {
        parent.childs = [];
      }
      collection = parent.childs;
      insertIdx = collection.indexOf(this.selectedReq) + 1;
    }
    if (this.selectedReq && this.selectedReq.parentId === '0') {
      insertIdx = collection.indexOf(this.selectedReq) + 1;
    }

    const req = new Requirement();
    req.reqId = uuidv4();
    req.name = this.form.get('newRequirement').value;
    req.projectId = this.projectService.projectId;

    req.order = insertIdx + 1;
    req.parentId = !this.selectedReq ? '0' : this.selectedReq.parentId;
    req.reqCode = 'USR-' + ('000' + (req.order + 1)).substr(-3, 3);
    req.color = req.parentId === '0' ? this.getNewEpicColor() : null;

    collection.splice(insertIdx, 0, req);

    for (let i = insertIdx; i < collection.length; i++) {
      collection[i].order = i;
    }

    console.log(collection);

    this.form.get('newRequirement').setValue('');

    this.reqService.shiftRequirementsOrder(req.parentId, insertIdx, 1);
    this.reqService.createRequirement(req);

    if (this.selectedReq) {
      this.selectReq(req);
    }

    this.insertingReq = false;

    return false;
  }

  removeRequirement(req: Requirement = null) {

    if (!req) {
      req = this.selectedReq;
    }
    if (!req) {
      return;
    }

    if (req.childs && req.childs.length > 0) {
      return;
    }

    const previous = this.findPreviousRequirement(req);

    let parent: Requirement;
    let collection = this.epics;
    if (req.parentId !== '0') {
      parent = this.epics.find(e => e.reqId === req.parentId);
      if (!parent) {
        return;
      }
      collection = parent.childs;
    }
    const idx = collection.indexOf(req);
    collection.splice(idx, 1);

    this.reqService.removeRequirement(req.reqId);
    this.reqService.shiftRequirementsOrder(req.parentId, req.order, -1);

    // move seleted requirement
    if (this.selectedReq) {
      if (idx >= 1 && this.selectedReq.parentId !== '0') {
        this.selectReq(collection[idx - 1]);
        return;
      }
      if (idx === 0 && this.selectedReq.parentId !== '0') {
        this.selectReq(parent);
        return;
      }
      if (this.selectedReq.parentId === '0') {
        if (!previous) {
          this.selectReq(null);
          return;
        }
        if (!previous.childs || previous.childs.length === 0) {
          this.selectReq(previous);
          return;
        }
        this.selectReq(previous.childs[previous.childs.length - 1]);
      }
    }

  }

  toStory(req: Requirement) {

    // can not convert to story an epic with childs
    if (req.childs && req.childs.length > 0) {
      return;
    }

    // find the new parent
    const parent = this.findPreviousParent(req);
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
    req.color = null;
    parent.childs.push(req);

    // update req parent at db
    this.reqService.updateRequirementParentId(req.reqId, req.parentId, req.order, req.color);

    // update epics order at db
    this.reqService.shiftRequirementsOrder('0', oldOrder, -1);

    console.log(this.epics);

  }

  /**
   * Converts a given story to epic.
   * @param req The storyto be converted to epic
   */
  toEpic(req: Requirement) {

    // finds the parent
    const parent = this.epics.find(r => r.reqId === req.parentId);
    if (!parent) {
      return;
    }

    // remove it from the parent childs
    const idx = parent.childs.findIndex(r => r.reqId === req.reqId);
    parent.childs.splice(idx, 1);

    // update other childs orders
    parent.childs.filter(r => r.order >= req.order).forEach(r => { r.order--; });

    // update epic orders
    const parentIdx = this.epics.indexOf(parent);
    this.epics.filter(r => r.order > parentIdx).forEach(r => { r.order++; });

    // adds it to the epic collection
    req.parentId = '0';
    const oldOrder = req.order;
    req.order = parentIdx + 1;
    req.color = this.getNewEpicColor();
    this.epics.splice(parentIdx + 1, 0, req);

    // update childs orders at db
    this.reqService.shiftRequirementsOrder(parent.reqId, oldOrder, -1);

    // update epic orders at db
    this.reqService.shiftRequirementsOrder('0', req.order, 1);

    // update req parentId at db
    this.reqService.updateRequirementParentId(req.reqId, req.parentId, req.order, req.color);


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


  private findPreviousRequirement(req: Requirement): Requirement {
    const reqIdx = this.epics.indexOf(req);
    if (reqIdx <= 0 ) {
      return null;
    }
    return this.epics[reqIdx - 1];
  }

  private findPreviousParent(req: Requirement): Requirement {
    const previousReq = this.findPreviousRequirement(req);
    if (previousReq.parentId === '0') {
      return previousReq;
    } else {
      return this.epics.find(r => r.reqId === previousReq.parentId);
    }
  }

  showReqDetail(req: Requirement) {
    this.router.navigate([`/${this.projectId}/requirements/${req.reqId}`]);
  }

  onEpicDragStart(e) {
    this.isDraggingEpic = true;
    this.cdr.detectChanges();
  }

  /**
   * Looks at the epics and its stories to find a given requirement.
   * @param reqId The requirement id
   */
  private findRequirement(reqId: string): Requirement {
    for (const e of this.epics) {
      if (e.reqId === reqId) {
        return e;
      }
      if (e.childs) {
        for (const s of e.childs) {
          if (s.reqId === reqId) {
            return s;
          }
        }
      }
    }
    return null;
  }

  private getNewEpicColor(usedCount = 0) {
    for (let i = 20; i >= 1; i--) {
      const used = this.epics.filter(e => e.color === 'pal' + i);
      if (!used || used.length === usedCount) {
        return 'pal' + i;
      }
    }
    return this.getNewEpicColor(usedCount++);
  }

}
