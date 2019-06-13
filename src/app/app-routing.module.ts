import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{MapComponent} from './map/map.component';
import { DesscritisationPdfComponent } from './desscritisation-pdf/desscritisation-pdf.component';

const routes: Routes = [
  {path:'map' , component:MapComponent},
  {path:'dess' , component:DesscritisationPdfComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingcomponents=[MapComponent]