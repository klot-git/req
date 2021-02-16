import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'summary',
    pathMatch: 'full'
  },
  {
    path: 'requirements',
    loadChildren: () => import('./req-list/req-list.module').then( m => m.ReqListPageModule)
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles-list/roles-list.module').then( m => m.RolesListPageModule)
  },
  {
    path: 'requirements/:id',
    loadChildren: () => import('./req-detail/req-detail.module').then( m => m.ReqDetailPageModule)
  },
  {
    path: 'summary',
    loadChildren: () => import('./prj-summary/prj-summary.module').then( m => m.PrjSummaryPageModule)
  },
  {
    path: 'export',
    loadChildren: () => import('./export/export.module').then( m => m.ExportPageModule)
  },
  {
    path: 'print',
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
