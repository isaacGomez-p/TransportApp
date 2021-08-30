import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MasInfoComponent } from './mas-info.component';

import { MasInfoComponentRoutingModule } from './mas-info.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    MasInfoComponentRoutingModule
  ],
  declarations: [MasInfoComponent]
})
export class MasInfoComponentModule {}