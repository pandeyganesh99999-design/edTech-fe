import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../shared/layouts/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent) },
      { path: 'add', loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent) },
      { path: 'edit/:id', loadComponent: () => import('./employee-form/employee-form.component').then(m => m.EmployeeFormComponent) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }