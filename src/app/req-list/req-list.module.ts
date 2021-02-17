import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReqListPageRoutingModule } from './req-list-routing.module';

import { ReqListPage } from './req-list.page';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    ReqListPageRoutingModule,
    DragDropModule
  ],
  declarations: [ReqListPage]
})
export class ReqListPageModule {}
