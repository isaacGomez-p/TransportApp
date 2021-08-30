import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServicioComponent } from './servicio.component';

import { ServicioComponentRoutingModule } from './servicio.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    ServicioComponentRoutingModule
  ],
  declarations: [ServicioComponent]
})
export class ServicioComponentModule {}
