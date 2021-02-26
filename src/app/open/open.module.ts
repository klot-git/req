import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenPageRoutingModule } from './open-routing.module';

import { OpenPage } from './open.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenPageRoutingModule
  ],
  declarations: [OpenPage]
})
export class OpenPageModule {}
