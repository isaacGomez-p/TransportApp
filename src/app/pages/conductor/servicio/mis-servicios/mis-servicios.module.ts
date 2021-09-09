import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MisServiciosComponent } from './mis-servicios.component';

import { MisServicioComponentRoutingModule } from './mis-servicios.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    MisServicioComponentRoutingModule
  ],
  declarations: [MisServiciosComponent]
})
export class MisServicioComponentModule {}
