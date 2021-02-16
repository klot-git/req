import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RolesListPageRoutingModule } from './roles-list-routing.module';

import { RolesListPage } from './roles-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RolesListPageRoutingModule
  ],
  declarations: [RolesListPage]
})
export class RolesListPageModule {}
