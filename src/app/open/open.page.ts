import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
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
    this.router.navigate([`/${projectId}/summary`]);
  }

  importProject(fileChangeEvent){
    const reader = new FileReader();
    reader.onload = async (e) => {
      const projectId = await this.templateService.importFromZip(e.target.result);
      if (projectId) {
        this.projectService.changeCurrentProject(projectId);
        this.router.navigate([`/${projectId}/summary`]);
      }
    };
    reader.readAsBinaryString(fileChangeEvent.target.files[0]);

  }


}
