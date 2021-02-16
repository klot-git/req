import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReqListPage } from './req-list.page';

const routes: Routes = [
  {
    path: '',
    component: ReqListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReqListPageRoutingModule {}
