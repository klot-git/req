import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReqDetailPage } from './req-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ReqDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReqDetailPageRoutingModule {}
