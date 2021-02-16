import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrjSummaryPage } from './prj-summary.page';

const routes: Routes = [
  {
    path: '',
    component: PrjSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrjSummaryPageRoutingModule {}
