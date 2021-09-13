import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EnRutaComponent } from './en-ruta.component';

import { EnRutaComponentRoutingModule } from './en-ruta.routing.module';


@NgModule({
  declarations: [EnRutaComponent],
  imports: [
    CommonModule,
    EnRutaComponentRoutingModule,
    IonicModule,
    FormsModule
  ]  
})
export class EnRutaComponentModule { }
