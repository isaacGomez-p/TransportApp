import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasInfoComponent } from './mas-info.component';

const routes: Routes = [
  {
    path: '', component: MasInfoComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasInfoComponentRoutingModule {}