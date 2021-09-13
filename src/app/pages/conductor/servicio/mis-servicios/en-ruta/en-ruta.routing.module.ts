import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnRutaComponent } from './en-ruta.component';

const routes: Routes = [
  {
    path: '', component: EnRutaComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnRutaComponentRoutingModule {}