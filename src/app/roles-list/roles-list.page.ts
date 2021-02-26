import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.page.html',
  styleUrls: ['./roles-list.page.scss'],
})
export class RolesListPage extends BaseProjectPage implements OnInit {

  constructor(
    route: ActivatedRoute,
    projectService: ProjectService) {
      super(route, projectService);
  }

  ngOnInit() {
  }

}
