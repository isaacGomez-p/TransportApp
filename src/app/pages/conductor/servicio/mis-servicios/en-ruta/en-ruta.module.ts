import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EnRutaComponent } from './en-ruta.component';

import { EnRutaComponentRoutingModule } from './en-ruta.routing.module';
import { ChatComponent } from 'src/app/pages/chat/chat.component';


@NgModule({
  declarations: [EnRutaComponent],
  imports: [
    CommonModule,
    EnRutaComponentRoutingModule,
    IonicModule,
    FormsModule,    
  ],  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EnRutaComponentModule { }
