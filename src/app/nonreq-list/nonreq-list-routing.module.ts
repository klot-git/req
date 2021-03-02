import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NonreqListPage } from './nonreq-list.page';

const routes: Routes = [
  {
    path: '',
    component: NonreqListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonreqListPageRoutingModule {}
