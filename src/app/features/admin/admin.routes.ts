import { Routes } from '@angular/router';
import { logedGuard } from '@app/core/guards/loged.guard';
import { Rutas } from '@app/shared/utils/rutas';

export default [
  {
    path: Rutas.TABLERO,
    loadComponent: () => import('./tablero/tablero.component'),
    canActivate: [logedGuard],
  },
  {
    path: Rutas.CATEGORIAS,
    loadComponent: () => import('./categorias/categorias.component'),
    canActivate: [logedGuard],
  },
  {
    path: Rutas.CUENTAS,
    loadComponent: () => import('./cuentas/cuentas.component'),
    canActivate: [logedGuard],
  },
  {
    path: Rutas.HOME,
    redirectTo: Rutas.TABLERO,
    pathMatch: 'full',
  },
] as Routes;
