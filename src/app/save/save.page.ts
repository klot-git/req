import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { FileService } from '../services/file.service';
import { TemplateService } from '../services/template.service';

import { v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-save',
  templateUrl: './save.page.html',
  styleUrls: ['./save.page.scss'],
})
export class SavePage extends BaseProjectPage implements OnInit {

  constructor(
    route: ActivatedRoute,
    fileService: FileService) {
      super(route, fileService);
  }

  ngOnInit() {
  }

  async saveAsLocal() {
    const newId = uuidv4();
    const jsonFile = await this.fileService.exportToZip(this.projectId, newId);
    console.log(jsonFile);
    await this.fileService.saveProject(jsonFile);
    console.log('reading');
    this.fileService.changeCurrentProject(jsonFile.project.projectId);
  }

}
