import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculoComponent } from './vehiculo.component';

import { VehiculoComponentRoutingModule } from './vehiculo.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    VehiculoComponentRoutingModule
  ],
  declarations: [VehiculoComponent]
})
export class VehiculoComponentModule {}
