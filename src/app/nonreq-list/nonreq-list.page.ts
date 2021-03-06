import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseProjectPage } from '../base-project.page';
import { NonFRequirement } from '../non-f-requirement';
import { NonFunctionalRequirementService } from '../services/nfreq.service';
import { ProjectService } from '../services/project.service';

import { v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-nonreq-list',
  templateUrl: './nonreq-list.page.html',
  styleUrls: ['./nonreq-list.page.scss'],
})
export class NonreqListPage extends BaseProjectPage implements OnInit {

  form: FormGroup;

  constructor(
    router: ActivatedRoute,
    projectService: ProjectService,
    private reqService: NonFunctionalRequirementService) {

      super(router, projectService);
      this.form = new FormGroup( { reqs: new FormArray([]) });
      this.loadRequirements();
  }

  ngOnInit() {
  }

  private async loadRequirements() {
    const reqsForms = this.form.get('reqs') as FormArray;
    const requirements = await this.reqService.loadRequirements(this.projectId);
    requirements.forEach(r => { reqsForms.push(this.createReqForm(r)); });
  }

  addRequirement() {
    const newReq = { reqId: uuidv4(), reqCode: this.getNextCode(), description: '', projectId: this.projectId } as NonFRequirement;
    const reqsForms = this.form.get('reqs') as FormArray;
    reqsForms.push(this.createReqForm(newReq));

    this.reqService.updateRequirement(newReq);
  }

  updateRequirement(reqForm: FormGroup) {
    const req = {
      reqId: reqForm.get('reqId').value,
      reqCode: reqForm.get('reqCode').value,
      description: reqForm.get('description').value,
      projectId: this.projectId
    } as NonFRequirement;

    this.reqService.updateRequirement(req);
  }

  async removeRequirement(reqForm: FormGroup) {
    const reqId = reqForm.get('reqId').value;
    await this.reqService.removeRequirement(reqId);

    const reqsForms = this.form.get('reqs') as FormArray;
    const formIdx = reqsForms.controls.indexOf(reqForm);
    reqsForms.removeAt(formIdx);
  }

  private createReqForm(req: NonFRequirement): FormGroup {
    return new FormGroup({
      reqId: new FormControl(req.reqId),
      reqCode: new FormControl(req.reqCode),
      description: new FormControl(req.description)
    });
  }

  private getNextCode() {
    if (!this.form || !this.form.get('reqs')) {
      return 'NR-001';
    }
    const reqsForms = this.form.get('reqs') as FormArray;
    let c = 1;
    while (c <= 999) {
      const code = 'NR-' + ('000' + (c)).substr(-3, 3);
      if (reqsForms.controls.findIndex(r => r.get('reqCode').value === code) < 0) {
        return code;
      }
      c++;
    }
    return '';
  }

}
