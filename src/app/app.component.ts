import { Component, OnInit } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConnectionService } from './services/db.service';
import { MessageService } from './services/message.service';
import { ProjectService } from './services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from './project';
import { EventAggregatorService } from './services/event-aggregator.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  selectedMenu = 'req';
  subMenuHidden = false;

  constructor(
    private menu: MenuController,
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: ConnectionService,
    private projectService: ProjectService,
    public messageService: MessageService,
    private events: EventAggregatorService
  ) {
    this.initializeApp();
    this.events.subscribe('CHANGE-MENU', m => { this.selectedMenu = m; });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.init();
  }

  private async init() {
    await this.db.initDB();
  }

  get project() {
    let prj = this.projectService.project;
    if  (!prj) {
      prj = {  name: '', client: '' } as Project;
    }
    return prj;
  }

  selectMenu(event) {
    this.selectedMenu = event.detail.value;
  }

  goToProject(page: string) {
    this.router.navigate([`/${this.project.projectId}/${page}`]);
    this.hideMenuByWidth();
  }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
    this.hideMenuByWidth();
  }

  private hideMenuByWidth() {
    console.log(this.platform.width());
    if (this.platform.width() < 1200) {
      this.subMenuHidden = true;
    }
    this.menu.close();
  }

  menuClick(event) {
    const value = event.target.attributes.value.value;
    if (this.selectedMenu === value) {
      this.subMenuHidden = !this.subMenuHidden;
      return;
    }
    this.subMenuHidden = false;
  }

  hideSubmenu() {
    this.subMenuHidden = true;
  }


}
