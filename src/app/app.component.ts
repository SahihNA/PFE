import { Component } from '@angular/core';
const ELEMENT_DATA = [
  {position: 1, name: 'Hydrogen'},
  {position: 2, name: 'Helium'},
  
];


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
 
   
})
export class AppComponent {
  dataSource=ELEMENT_DATA;
  title = 'client-app';
  displayedColumns = ['position'];

  addColumn() {
    
  }
 
  


  ngOnInit() {
    
    }

  }

  
  



 

