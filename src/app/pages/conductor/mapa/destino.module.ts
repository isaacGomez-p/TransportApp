import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinoComponent } from './destino.component';

import { DestinoComponentRoutingModule } from './destino.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    DestinoComponentRoutingModule
  ],
  declarations: [DestinoComponent]
})
export class DestinoComponentModule {}