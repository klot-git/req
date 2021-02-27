import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BaseProjectPage } from '../base-project.page';
import { Project } from '../project';
import { EventAggregatorService } from '../services/event-aggregator.service';
import { ProjectService } from '../services/project.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-open',
  templateUrl: './open.page.html',
  styleUrls: ['./open.page.scss'],
})
export class OpenPage extends BaseProjectPage implements OnInit {

  projects: Project[] = [];

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService,
    private events: EventAggregatorService,
    private router: Router,
    private alertController: AlertController,
    private templateService: TemplateService) {

    super(route, projectService);
  }

  ionViewDidEnter() {
    this.loadProjects();
  }

  ngOnInit() {
  }

  async loadProjects() {
    this.projects = await this.projectService.loadProjects(5);
  }

  openProject(projectId: string) {
    this.projectService.changeCurrentProject(projectId);
    this.navigateToNewProject(projectId);
  }

  importProject(fileChangeEvent){
    const reader = new FileReader();
    reader.onload = async (e) => {
      const projectId = await this.templateService.importFromZip(e.target.result);
      if (projectId) {
        this.projectService.changeCurrentProject(projectId);
        this.navigateToNewProject(projectId);
      }
    };
    reader.readAsBinaryString(fileChangeEvent.target.files[0]);
  }

  private navigateToNewProject(projectId: string) {
    this.router.navigate([`/${projectId}/summary`]);
    this.events.publish('CHANGE-MENU', 'req');
  }

  async removeProject(prj: Project) {

    if (this.projectId === prj.projectId) {
      return;
    }

    await this.projectService.removeProject(prj.projectId);
    const idx = this.projects.indexOf(prj);
    this.projects.splice(idx, 1);
  }

  async confirmRemove(prj: Project, event) {

    if (event) {
      event.preventDefault();
      event.cancelBubble = true;
    }

    const alert = await this.alertController.create({
      cssClass: 'alert-custom-class',
      header: `Remove project '${prj.name}'?`,
      message: 'If you want to access this project later, make sure to have saved it to disk before remove it from memory.',
      buttons: [
        {
          text: 'Remove',
          cssClass: 'danger',
          handler: () => {
            this.removeProject(prj);
            return true;
          }
        },
        {
          text: 'Save it',
          handler: () => {
            this.templateService.exportToJson(this.projectId);
            return true;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'medium'
        }
      ]
    });

    await alert.present();
  }

}
