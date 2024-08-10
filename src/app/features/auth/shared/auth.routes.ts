import { Routes } from '@angular/router';
import { publicGuard } from '@app/core/guards/public.guard';
import { Rutas } from '@app/shared/utils/rutas';

export default [
  {
    path: Rutas.LOGIN,
    loadComponent: () => import('../login/login.component'),
    canActivate: [publicGuard],
  },
  {
    path: Rutas.REGISTER,
    loadComponent: () => import('../register/register.component'),
    canActivate: [publicGuard],
  },
  {
    path: Rutas.OLVIDE_CLAVE,
    loadComponent: () => import('../olvide-clave/olvide-clave.component'),
    canActivate: [publicGuard],
  },
  {
    path: `${Rutas.CAMBIAR_CLAVE}/:token`,
    loadComponent: () => import('../cambiar-clave/cambiar-clave.component'),
    canActivate: [publicGuard],
  },
  {
    path: `${Rutas.VERIFICAR_USER}/:token`,
    loadComponent: () => import('../verify-account/verify-account.component'),
    canActivate: [publicGuard],
  },
] as Routes;
