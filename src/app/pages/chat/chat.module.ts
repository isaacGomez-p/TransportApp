import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';

import { ChatComponentRoutingModule } from './chat.routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,    
    ChatComponentRoutingModule
  ],
  exports:[ChatComponent],
  declarations: [ChatComponent]  
})
export class ChatComponentModule {}