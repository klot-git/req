import { ActivatedRoute } from '@angular/router';
import { ProjectService } from './services/project.service';

export class BaseProjectPage {

  constructor(
      protected route: ActivatedRoute,
      protected projectService: ProjectService
      ) {
  }

  get projectId() {
    let urlPrjId = this.route.snapshot.paramMap.get('id');
    if (urlPrjId === 'last' || !urlPrjId) {
      urlPrjId = this.projectService.projectId;
    }
    return urlPrjId;
  }

}