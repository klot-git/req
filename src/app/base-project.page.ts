import { ActivatedRoute } from '@angular/router';
import { ProjectService } from './services/project.service';

export class BaseProjectPage {

  constructor(
      protected route: ActivatedRoute,
      protected projectService: ProjectService) {

      if (this.projectId !== this.projectService.projectId) {
        this.projectService.changeCurrentProject(this.projectId);
      }
  }

  get projectId() {
    let urlPrjId = this.route.snapshot.paramMap.get('id');
    if (urlPrjId === 'last' || !urlPrjId) {
      urlPrjId = this.projectService.projectId;
    }
    return urlPrjId;
  }

  ionViewDidEnter() {
    // remove tabs from QUILL toolbar
    const tabHideEls = document.querySelectorAll('.ql-toolbar button, .ql-toolbar select, .ql-toolbar .ql-picker-label');
    tabHideEls.forEach(e => { e.setAttribute('tabindex', '-1'); });
  }

}