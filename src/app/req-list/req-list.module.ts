import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReqListPageRoutingModule } from './req-list-routing.module';

import { ReqListPage } from './req-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    ReqListPageRoutingModule
  ],
  declarations: [ReqListPage]
})
export class ReqListPageModule {}
