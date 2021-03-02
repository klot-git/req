import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonreqListPageRoutingModule } from './nonreq-list-routing.module';

import { NonreqListPage } from './nonreq-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    NonreqListPageRoutingModule
  ],
  declarations: [NonreqListPage]
})
export class NonreqListPageModule {}
