import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { Project } from '../project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-open',
  templateUrl: './open.page.html',
  styleUrls: ['./open.page.scss'],
})
export class OpenPage extends BaseProjectPage implements OnInit {

  projects: Project[];

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService) {

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

}
