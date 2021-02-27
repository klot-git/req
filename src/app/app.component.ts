import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConnectionService } from './services/db.service';
import { MessageService } from './services/message.service';
import { ProjectService } from './services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Project } from './project';
import { EventAggregatorService } from './services/event-aggregator.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  selectedMenu = 'req';

  constructor(
    private route: ActivatedRoute,
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



}
