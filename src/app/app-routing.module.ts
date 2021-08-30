import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'login',    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)},
  { path: 'registro',    loadChildren: () => import('./pages/login/registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'conductor',    loadChildren: () => import('./pages/login/registro/conductor/conductor.module').then(m => m.ConductorComponentModule) }, 
  { path: 'perfil',    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule) },  
  { path: 'vehiculos',    loadChildren: () => import('./pages/conductor/vehiculo/vehiculo.module').then(m => m.VehiculoComponentModule) },  
  { path: 'servicios',    loadChildren: () => import('./pages/usuario/servicio/servicio.module').then(m => m.ServicioComponentModule) },  
  { path: 'agregarServicios',    loadChildren: () => import('./pages/usuario/servicio/agregar/agregar.module').then(m => m.AgregarComponentModule) },  
  { path: 'serviciosDisponibles',    loadChildren: () => import('./pages/conductor/servicio/servicio.module').then(m => m.ServicioComponentModule) },  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
