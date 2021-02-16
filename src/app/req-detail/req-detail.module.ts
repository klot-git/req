import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReqDetailPageRoutingModule } from './req-detail-routing.module';

import { QuillModule } from 'ngx-quill';

import { quillModules } from '../app.module';
import { ReqDetailPage } from './req-detail.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    ReqDetailPageRoutingModule,
    QuillModule.forRoot({modules: quillModules, placeholder: ''})
  ],
  declarations: [ReqDetailPage]
})
export class ReqDetailPageModule {}
