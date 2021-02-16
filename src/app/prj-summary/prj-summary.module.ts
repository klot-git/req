import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrjSummaryPageRoutingModule } from './prj-summary-routing.module';

import { PrjSummaryPage } from './prj-summary.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    PrjSummaryPageRoutingModule,
    QuillModule.forRoot()
  ],
  declarations: [PrjSummaryPage]
})
export class PrjSummaryPageModule {}
