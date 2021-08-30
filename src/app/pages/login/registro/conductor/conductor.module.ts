import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConductorComponent } from './conductor.component';

import { ConductorComponentRoutingModule } from './conductor.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    ConductorComponentRoutingModule
  ],
  declarations: [ConductorComponent]
})
export class ConductorComponentModule {}