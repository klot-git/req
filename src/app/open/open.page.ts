import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { Project } from '../project';
import { ProjectService } from '../services/project.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-open',
  templateUrl: './open.page.html',
  styleUrls: ['./open.page.scss'],
})
export class OpenPage extends BaseProjectPage implements OnInit {

  projects: Project[];

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService,
    private templateService: TemplateService) {

    super(route, projectService);
    this.loadProjects();
  }

  ngOnInit() {
  }

  async loadProjects() {
    this.projects = await this.projectService.loadProjects();
  }

  openProject(projectId: string) {
    this.projectService.changeCurrentProject(projectId);
  }

  importProject(fileChangeEvent){
    const file = fileChangeEvent.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('reading');
      this.templateService.importFromZip(e.target.result);
    };
    reader.readAsBinaryString(fileChangeEvent.target.files[0]);

  }


}
