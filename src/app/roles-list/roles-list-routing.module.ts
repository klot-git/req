import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesListPage } from './roles-list.page';

const routes: Routes = [
  {
    path: '',
    component: RolesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesListPageRoutingModule {}
