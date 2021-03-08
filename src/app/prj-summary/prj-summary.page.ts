import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { Project } from '../project';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-prj-summary',
  templateUrl: './prj-summary.page.html',
  styleUrls: ['./prj-summary.page.scss'],
})
export class PrjSummaryPage extends BaseProjectPage implements OnInit {

  project: Project;
  form: FormGroup;

  constructor(route: ActivatedRoute, fileService: FileService) {

    super(route, fileService);

    this.project = new Project();

    this.fileService.loadProjectAsCurrent(this.projectId).then(p => {
      this.project = p;
      this.bindToScreen();
    });

    this.form = new FormGroup({
      name: new FormControl(this.project.name),
      client: new FormControl(this.project.client),
      vision: new FormControl(this.project.data.vision),
      goals: new FormControl(this.project.data.goals)
    });
  }

  ngOnInit() {
  }

  private bindToScreen() {
    this.form.get('name').setValue(this.project.name);
    this.form.get('client').setValue(this.project.client);
    this.form.get('vision').setValue(this.project.data.vision);
    this.form.get('goals').setValue(this.project.data.goals);
  }

  private bindToObject() {
    this.project.name = this.form.get('name').value;
    this.project.client = this.form.get('client').value;
    this.project.data.vision = this.form.get('vision').value;
    this.project.data.goals = this.form.get('goals').value;
  }

  ionViewWillLeave() {
    this.bindToObject();
    this.fileService.updateProject(this.project);
  }

}
