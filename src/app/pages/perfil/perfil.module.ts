import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilComponent } from './perfil.component';

import { PerfilPageRoutingModule } from './perfil.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    PerfilPageRoutingModule
  ],
  declarations: [PerfilComponent]
})
export class PerfilPageModule {}
