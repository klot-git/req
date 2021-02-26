import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { ProjectService } from '../services/project.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage extends BaseProjectPage implements OnInit {

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService,
    private templateService: TemplateService) {
      super(route, projectService);
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
