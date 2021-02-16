import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Requirement, RequirementData } from '../requirement';
import { ReqService } from '../services/req.service';

@Component({
  selector: 'app-req-detail',
  templateUrl: './req-detail.page.html',
  styleUrls: ['./req-detail.page.scss'],
})
export class ReqDetailPage implements OnInit {

  // https://github.com/KillerCodeMonkey/ngx-quill

  form: FormGroup;

  req: Requirement;

  constructor(
    private reqService: ReqService,
    private route: ActivatedRoute) {

    this.req = new Requirement();
    this.req._id = this.route.snapshot.paramMap.get('id');

    this.form = new FormGroup({
      description: new FormControl('')
    });
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.req = await this.reqService.loadRequirement(this.req._id);
  }

}
