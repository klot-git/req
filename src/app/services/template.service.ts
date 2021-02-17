import { Injectable } from '@angular/core';
import { ReqService } from './req.service';

import { HttpClient } from '@angular/common/http';

import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import FileSaver from 'file-saver';

import Mark from 'markup-js';

import { ProjectService } from './project.service';
import { MessageService } from './message.service';


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

    const context = {
      project,
      requirements: reqs
    };

    const template = await this.http.get('assets/templates/default.html', {responseType: 'text'}).toPromise();

    const output = Mark.up(template, context);

    this.messageService.isLoadingData = false;

    return new Blob([output], {type: 'text/html;charset=utf-8'});
  }


}
