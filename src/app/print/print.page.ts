import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
})
export class PrintPage implements OnInit {

  constructor(
    private templateService: TemplateService) { }

  ngOnInit() {
  }

  export() {
    this.templateService.exportToHtml();
  }

  print() {
    this.templateService.print();
  }

}
