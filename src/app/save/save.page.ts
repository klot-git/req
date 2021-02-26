import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { ProjectService } from '../services/project.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.page.html',
  styleUrls: ['./save.page.scss'],
})
export class SavePage extends BaseProjectPage implements OnInit {

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService,
    private templateService: TemplateService) {
      super(route, projectService);
  }

  ngOnInit() {
  }

  saveAsLocal() {
    this.templateService.exportToJson(this.projectId);
  }

}
