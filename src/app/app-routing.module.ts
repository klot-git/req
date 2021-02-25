import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'last/summary',
    pathMatch: 'full'
  },
  {
    path: ':id/requirements',
    loadChildren: () => import('./req-list/req-list.module').then( m => m.ReqListPageModule)
  },
  {
    path: ':id/roles',
    loadChildren: () => import('./roles-list/roles-list.module').then( m => m.RolesListPageModule)
  },
  {
    path: ':id/requirements/:prjId',
    loadChildren: () => import('./req-detail/req-detail.module').then( m => m.ReqDetailPageModule)
  },
  {
    path: ':id/summary',
    loadChildren: () => import('./prj-summary/prj-summary.module').then( m => m.PrjSummaryPageModule)
  },
  {
    path: ':id/export',
    loadChildren: () => import('./export/export.module').then( m => m.ExportPageModule)
  },
  {
    path: ':id/print',
    loadChildren: () => import('./print/print.module').then( m => m.PrintPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
