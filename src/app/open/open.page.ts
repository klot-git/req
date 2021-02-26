import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-open',
  templateUrl: './open.page.html',
  styleUrls: ['./open.page.scss'],
})
export class OpenPage extends BaseProjectPage implements OnInit {

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService) {
      super(route, projectService);
  }

  ngOnInit() {
  }

}
