import { Routes } from '@angular/router';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { Rutas } from './shared/utils/rutas';

export const routes: Routes = [
  {
    path: Rutas.HOME,
    loadChildren: () => import('./features/home/home.routes'),
  },
  {
    path: Rutas.HOME,
    loadChildren: () => import('./features/auth/shared/auth.routes'),
  },
  {
    path: Rutas.APP,
    loadChildren: () => import('./features/admin/admin.routes'),
  },
  {
    path: Rutas.NOT_FOUND,
    component: NotfoundComponent,
    pathMatch: 'full',
  },
];
