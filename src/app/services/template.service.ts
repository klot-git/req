import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectService } from './project.service';
import { ReqService } from './req.service';
import { MessageService } from './message.service';
import { Requirement } from '../requirement';

import FileSaver from 'file-saver';
import Mark from 'markup-js';
import { Project } from '../project';
import PizZip from 'pizzip';



@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private projectService: ProjectService,
    private reqService: ReqService) {
  }

  async exportToHtml() {
    const blob = await this.renderHtml();
    FileSaver.saveAs(blob, 'teste.html');
  }

  async print() {
    const blob = await this.renderHtml();
    const iFrame = document.createElement('iframe');
    iFrame.src = URL.createObjectURL(blob);
    iFrame.onload = () => {
      iFrame.contentWindow.print();
    };
    document.body.appendChild(iFrame);
  }

  private async renderHtml(): Promise<Blob> {

    this.messageService.blockUI();

    const project = await this.projectService.loadProject(this.projectService.projectId, true);
    const reqs = await this.reqService.loadRequirements(this.projectService.projectId, true);
    const epics = this.reqService.groupRequirementsIntoEpics(reqs);

    const wbs = this.createWbsHtml(project.name, epics);

    const context = {
      host: location.origin,
      project,
      epics,
      wbs
    };

    const template = await this.http.get('assets/templates/default.html', {responseType: 'text'}).toPromise();

    const output = Mark.up(template, context);

    this.messageService.isLoadingData = false;

    return new Blob([output], {type: 'text/html;charset=utf-8'});
  }

  private createWbsHtml(projectName: string, epics: Requirement[]) {

    let html = ``;
    html +=  `<div class="project"><div class="box prj">${projectName}</div></div>`;
    html +=  `<div class="project"><svg height="10" width="2"><line x1="0" y1="0" x2="0" y2="10" class="line" /></svg></div>`;

    let epicsColumns = ``;
    epics.forEach(e => {
      let column = ``;
      if (e.order === 0) {
        column += `<svg height="2" width="100%"><line x1="50%" y1="0" x2="100%" y2="0" class="line"/></svg>`;
      } else if (e.order === epics.length - 1) {
        column += `<svg height="2" width="100%"><line x1="0" y1="0" x2="50%" y2="0" class="line"/></svg>`;
      } else {
        column += `<svg height="2" width="100%"><line x1="0" y1="0" x2="100%" y2="0" class="line"/></svg>`;
      }
      column += `<svg height="10" width="2"><line x1="0" y1="0" x2="0" y2="10" class="line" /></svg>`;
      column += `<div class="box epic epicBG ${e.color}">${e.name}</div>`;
      if (e.childs) {
        e.childs.forEach(s => {
          column += `<svg height="10" width="2"><line x1="0" y1="0" x2="0" y2="10" class="line" /></svg><div class="box story epicBG ${e.color}">${s.name}</div>`;
        });
      }
      epicsColumns += `<div class="epic-column">${column}</div>`;
    });
    html += `<div class="epics">${epicsColumns}</div>`;
    return `<div class="wbs">${html}</div>`;
  }

  async exportToJson(projectId: string) {

    // read project
    const project = await this.projectService.loadProject(projectId, true);
    const requirements = await this.reqService.loadRequirements(projectId, true);

    // create json object
    const jsonObject = this.createProjectJsonObject(project, requirements);

    // zip it
    const zip = new PizZip();
    zip.file('project-data.json', JSON.stringify(jsonObject));
    const blob = zip.generate({ type: 'blob' });

    // save it
    const filename = project.client + '-' + project.name + '.zip';
    FileSaver.saveAs(blob, filename);
  }

  createProjectJsonObject(project: Project, requirements: Requirement[]): any {
    return {
      project,
      requirements,
      _exportedAt: new Date()
    };
  }


}
