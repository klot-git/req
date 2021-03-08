import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { FileService } from '../services/file.service';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-save',
  templateUrl: './save.page.html',
  styleUrls: ['./save.page.scss'],
})
export class SavePage extends BaseProjectPage implements OnInit {

  constructor(
    route: ActivatedRoute,
    fileService: FileService,
    private templateService: TemplateService) {
      super(route, fileService);
  }

  ngOnInit() {
  }

  saveAsLocal() {
    this.templateService.exportToJson(this.projectId);
  }

}
