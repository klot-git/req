import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  constructor(
    private templateService: TemplateService) { }

  ngOnInit() {
  }

}
