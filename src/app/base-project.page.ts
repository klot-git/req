import { ActivatedRoute } from '@angular/router';
import { FileService } from './services/file.service';

export class BaseProjectPage {

  constructor(
      protected route: ActivatedRoute,
      protected fileService: FileService) {

      if (this.projectId !== this.fileService.projectId) {
        this.fileService.changeCurrentProject(this.projectId);
      }
  }

  get projectId() {
    let urlPrjId = this.route.snapshot.paramMap.get('id');
    if (urlPrjId === 'last' || !urlPrjId) {
      urlPrjId = this.fileService.projectId;
    }
    return urlPrjId;
  }

}