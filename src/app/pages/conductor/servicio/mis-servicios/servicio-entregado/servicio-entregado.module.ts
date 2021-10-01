import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioEntregadoComponent } from './servicio-entregado.component';

import { ServicioEntregadoComponentRoutingModule } from './servicio-entregado.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    ServicioEntregadoComponentRoutingModule
  ],
  declarations: [ServicioEntregadoComponent]
})
export class ServicioEntregadoComponentModule {}