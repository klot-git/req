import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReqDetailPageRoutingModule } from './req-detail-routing.module';

import { QuillModule } from 'ngx-quill';


import { ReqDetailPage } from './req-detail.page';
import { SharedModule, quillToolbar } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    ReqDetailPageRoutingModule,
    SharedModule,
    QuillModule.forRoot({modules: quillToolbar, placeholder: ''})
  ],
  declarations: [ReqDetailPage]
})
export class ReqDetailPageModule {}
