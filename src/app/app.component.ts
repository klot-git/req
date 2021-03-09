import { Component, HostListener, OnInit } from '@angular/core';

import { MenuController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConnectionService } from './services/db.service';
import { MessageService } from './services/message.service';
import { FileService } from './services/file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from './project';
import { EventAggregatorService } from './services/event-aggregator.service';
import { TemplateService } from './services/template.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  selectedMenu = 'req';
  subMenuHidden = false;

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'KeyS':
      if (event.ctrlKey) {
        this.save();
        event.preventDefault();
        event.returnValue = false;
        return false;
      }
      break;
    }
  }

  constructor(
    private menu: MenuController,
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private db: ConnectionService,
    private fileService: FileService,
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
    let prj = this.fileService.project;
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

  save() {
    this.fileService.exportToZip(this.project.projectId);
  }


}
