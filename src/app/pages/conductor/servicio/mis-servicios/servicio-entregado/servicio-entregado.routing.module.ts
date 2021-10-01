import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioEntregadoComponent } from './servicio-entregado.component';

const routes: Routes = [
  {
    path: '', component: ServicioEntregadoComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicioEntregadoComponentRoutingModule {}