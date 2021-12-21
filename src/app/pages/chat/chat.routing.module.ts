import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
import { ChatComponent } from './chat.component';

const routes: Routes = [
  {
    path: '', component: ChatComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatComponentRoutingModule {}