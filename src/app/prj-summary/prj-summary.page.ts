import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-prj-summary',
  templateUrl: './prj-summary.page.html',
  styleUrls: ['./prj-summary.page.scss'],
})
export class PrjSummaryPage implements OnInit {

  project: Project;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService) {

    this.project = new Project();

    this.projectService.loadProjectAsCurrent().then(p => {
      this.project = p;
      this.bindToScreen();
    });

    this.form = new FormGroup({
      name: new FormControl(this.project.name),
      client: new FormControl(this.project.client),
      description: new FormControl(this.project.description)
    });
  }

  ngOnInit() {

  }

  private bindToScreen() {
    this.form.get('name').setValue(this.project.name);
    this.form.get('client').setValue(this.project.client);
    this.form.get('description').setValue(this.project.description);
  }

  private bindToObject() {
    this.project.name = this.form.get('name').value;
    this.project.client = this.form.get('client').value;
    this.project.description = this.form.get('description').value;
  }

  ionViewWillLeave() {
    this.bindToObject();
    this.projectService.updateProject(this.project);
  }

}
