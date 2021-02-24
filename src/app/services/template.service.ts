import { Injectable } from '@angular/core';
import { ReqService } from './req.service';

import { HttpClient } from '@angular/common/http';

import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import FileSaver from 'file-saver';

import Mark from 'markup-js';

import { ProjectService } from './project.service';
import { MessageService } from './message.service';
import { Requirement } from '../requirement';


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

    const project = await this.projectService.loadCurrentProject();
    const reqs = await this.reqService.loadRequirements(true);
    const epics = this.reqService.groupRequirementsIntoEpics(reqs);

    const wbs = this.createWbsSVG(project.name, epics);

    const context = {
      host: 'http://localhost:8100',
      project,
      epics,
      wbsSVG: wbs
    };

    const template = await this.http.get('assets/templates/default.html', {responseType: 'text'}).toPromise();

    const output = Mark.up(template, context);

    this.messageService.isLoadingData = false;

    return new Blob([output], {type: 'text/html;charset=utf-8'});
  }

  private createWbsSVG(projectName: string, epics: Requirement[]) {
    let svg = '';
    svg = `<g><rect x="0" y="0" width="100" height="100" fill="red"></rect><text x="0" y="50" width="100" height="100" font-family="Verdana" font-size="10" fill="blue">${projectName}</text></g>`;
    return `<svg width="100%">${svg}</svg>`;
  }


}
