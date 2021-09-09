import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisServiciosComponent } from './mis-servicios.component';

const routes: Routes = [
  {
    path: '', component: MisServiciosComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisServicioComponentRoutingModule {}
