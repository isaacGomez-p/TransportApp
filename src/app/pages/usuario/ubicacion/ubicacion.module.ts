import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UbicacionComponent } from './ubicacion.component';

import { UbicacionComponentRoutingModule } from './ubicacion.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    UbicacionComponentRoutingModule
  ],
  declarations: [UbicacionComponent]
})
export class AgregarComponentModule {}