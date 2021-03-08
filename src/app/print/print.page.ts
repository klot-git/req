import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { FileService } from '../services/file.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage extends BaseProjectPage implements OnInit {

  constructor(
    route: ActivatedRoute,
    fileService: FileService,
    private templateService: TemplateService) {
      super(route, fileService);
  }

  ngOnInit() {
  }

  export() {
    this.templateService.exportToHtml(this.projectId);
  }

  print() {
    this.templateService.print(this.projectId);
  }

}
