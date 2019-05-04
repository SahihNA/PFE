import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { MapService } from '../shared/map.service';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import 'chartjs-plugin-zoom';
import * as XLSX from 'xlsx';

var m=this;
var V_B_N;
declare let L;



const elements_tableau = [
];
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']

})
export class MapComponent implements OnInit {
  
  canvas: any;
  ctx: any;
  //chart: Chart;
  list_communesjson={};
  circlemarkers;
  polygones;
  public selectedId:any;
  couleur;
  dictTable:any[];
  globaldataChart={};
  list_nom_communes:any[];
  list_valeur_indicateur: any[];
  list_Nom_Indicateur:any[];
  list_Communes=[];
  list_V_byNomIndicateur:any[];
  list_OnlyValues_byNomIndicateur=[];
  indicateurs_choisis=[];
  indicateurs_choisis_chart=[];
  infoIndicateur=[];
  dropdownIndicateur;
  dataSource = new MatTableDataSource([]);
  legendData={};
  NotlegendData=[];
  mapData={};
  degradecouleurg=['#FFEDA0', '#FEB24C'  ,'#FC4E2A' , '#E31A1C'  ,'#800026' ];

  displayedColumns: string[] = [];
 
  list:any[];
   myStyle = {
    "color": 'red',
    "weight": 5,
    "opacity": 0.65,
     fillColor: 'green',
};
map;
info;


@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;


  constructor(private service: MapService) { }

  ngOnInit() {
   
    
    
    $(window).click(function () {
      $('#test').css('background-color', 'red');
      });

   this.service.getJSON().subscribe(data => {
     console.log('here json');
     this.list_communesjson=data.features;
    console.log(this.list_communesjson);
  this.p(data.features);
  });

    this.service.getNomIndicateur().subscribe(
      (res) => {
        this.list_Nom_Indicateur = res;
   
        console.log(this.list_Nom_Indicateur);
      }/*,
      (err) => {
        alert("erreur lors de la get des Noms Indicateur");
      }*/
    );

    this.service. getCommunes().subscribe(
      (res) => {
        this.list_Communes = res;
       // this.list_nom_communes.sort();
        this.displayedColumns.push('commune');
       var t=[];
        for(var i=0;i<this.list_Communes.length;i++){
          elements_tableau[i]={};
         
         elements_tableau[i]["commune"] =this.list_Communes[i].nomC;
         t.push(this.list_Communes[i].nomC);
       // this.dataSource = elements_tableau;
        this.dataSource = new MatTableDataSource(elements_tableau);
        this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    
        } 
        this.list_nom_communes=t;
      }/*,
      (err) => {
        alert("erreur lors de la get des Noms Indicateur");
      }*/
    );

  
   //var markerClusters = L.markerClusterGroup();
    
   this.map = L.map('map').setView([32, -7], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
       // this.map.addLayer( markerClusters );

console.log(this.info);


this.infoPut();
 
        
  }

  ShowHidden(){
    document.getElementById("dropProvince").style.visibility = "visible";
    document.getElementById("dropRegion").style.visibility = "visible";
  }

  getDecoupage(x,y,z){
    if(x==='Commune'){
      if(y!=0){
        console.log(y);
      }
      else{
        console.log(z);
      }
     
    }

    if(x=='Province'){

    }
    if(x=='Région'){
      
    }

  }

  ShowModal(){

  }
  p( x){
    var myStyle = {
      weight: 5,
          fillColor: "orange",
          color: 'blue',
          dashArray: '',
          fillOpacity: 0.7
  };
  
  L.geoJSON(x, {
      style: myStyle
  }).addTo(this.map);  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  putchart(data){
      var labels =this.list_nom_communes;
    //var bgColor = ["#878BB6", "#FFEA88", "#FF8153", "#4ACAB4", "#c0504d", "#8064a2", "#772c2a", "#f2ab71", "#2ab881", "#4f81bd", "#2c4d75"];
    $('#myChart').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="myChart"><canvas>');
      this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    var chart = new Chart(this.ctx, {
      // The type of chart we want to create
      type: 'bar',
      data: {
          labels: labels,
          datasets: [
            {
              label: data ,
              data: this.globaldataChart[data],
              backgroundColor: 'green'
            }]
      },
      options: {
        spanGaps: true,
        scales: {
          xAxes: [
              {
                  ticks: {
                      display: false
                  }
              }
          ],
      },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              enabled: true,
              mode: 'x'
            }
          }
        },
       
    

       
        
      hover: {
  
        onHover :function(clickEvt,evt) {
          var h=[];
          h.push(evt[0]);

          if(h[0]!==undefined){
            console.log(h[0]._model);
          console.log(h[0]._model.label);}
        }
       
      },
    
      onClick:function(clickEvt,activeElems) {
       // console.log(activeElems);
      }
     
    }
  });
 

  
   
  }

  geti(indic){
    this.service.getValeurByNomIndicateur(indic).subscribe(
      (res) => {
      V_B_N=res;  
        this.list_V_byNomIndicateur = res;
        this.populateMap();

     this.populateTable();
      },
      (err) => {
        alert("erreur lors de la get des incident");
      }
    );
    
  }

  getValeurByNomIndicateur(indic){
   

    this.service.getOnlyValuesByNomIndicateur(indic).subscribe(
      (res) => {
        if (! (indic in this.mapData)){
          this.dropdownIndicateur=indic;

          this.list_OnlyValues_byNomIndicateur = res;
          this.getInfoIndicateur(indic);
          //this.CalculIntervalles();
         
        }

      }, 
      (err) => {
        alert("erreur lors de la get des incident");
      }
    );
  }

  getInfoIndicateur(indic){
    this.service.getInfoIndicateur(indic).subscribe(
      (res) => {
 
          this.infoIndicateur = res;
          this.CalculIntervalles();
 
      }, 
      (err) => {
        alert("erreur lors de la get des incident");
      }
    );
  }

  CalculIntervalles(){
       var arraydivision8=[];
       var arraydivision4=[];
       var effectif=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
       var effectif4=[0,0,0,0,0,0,0,0];
       var moyenne=0;
       var mode=0;
      var m= (Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/64;
      var m4=(Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/8;
    
      var n=Math.trunc(m);
      var n4=Math.trunc(m4);
      var min=Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
      for(var i=0;i<7;i++){
        arraydivision4.push([min,min+n4]);
        min=min+n4;
      }
      arraydivision4.push([min,min+n+8*(m-n)]);
      min=Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
      for(var i=0;i<63;i++){
        arraydivision8.push([min,min+n]);
        min=min+n;
      }
      arraydivision8.push([min,min+n+64*(m-n)]);
     
     
      

      for(var i=0;i<this.list_OnlyValues_byNomIndicateur.length;i++){
         
        if(arraydivision8[0][0]<= this.list_OnlyValues_byNomIndicateur[i] && this.list_OnlyValues_byNomIndicateur[i]<=arraydivision8[0][1]){
                  effectif[0]=effectif[0]+1;
        } }

        for(var i=0;i<this.list_OnlyValues_byNomIndicateur.length;i++){
         
          if(arraydivision4[0][0]<= this.list_OnlyValues_byNomIndicateur[i] && this.list_OnlyValues_byNomIndicateur[i]<=arraydivision4[0][1]){
                    effectif4[0]=effectif4[0]+1;
          } }


      for(var i=0;i<this.list_OnlyValues_byNomIndicateur.length;i++){
       
        for(var j=1;j<arraydivision4.length;j++){
         
          if(arraydivision4[j][0]< this.list_OnlyValues_byNomIndicateur[i] && this.list_OnlyValues_byNomIndicateur[i]<=arraydivision4[j][1]){
                    effectif4[j]=effectif4[j]+1;
          }
                 
          }
      }

      for(var i=0;i<this.list_OnlyValues_byNomIndicateur.length;i++){
       
        for(var j=1;j<arraydivision8.length;j++){
         
          if(arraydivision8[j][0]< this.list_OnlyValues_byNomIndicateur[i] && this.list_OnlyValues_byNomIndicateur[i]<=arraydivision8[j][1]){
                    effectif[j]=effectif[j]+1;
          }
                 
          }
      }
     
      console.log('eff4---'+effectif4);
     
      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      
      console.log('eff---'+effectif);
     
     
      for(var j=0;j<arraydivision8.length;j++){
       
          moyenne+=(((arraydivision8[j][1]-arraydivision8[j][0])/2)*effectif[j]);
         
        }
       
        moyenne=moyenne/(effectif.reduce(reducer)); 
        console.log('moye'+moyenne);
        let d =effectif.indexOf(Math.max.apply(null,effectif));
        mode=(arraydivision8[d][1]-arraydivision8[d][0])/2;
        var binaire=[];
        for(var i=0;i<effectif4.length-1;i++){
          if(effectif4[i]<=effectif4[i+1]){binaire[i]=1;}
          else binaire[i]=0;

        }
        var changement=0;
        for(var i=0;i<effectif4.length-1;i++){
          if(binaire[i]!=binaire[i+1]){changement=+changement}
         

        }
        console.log(changement);
        console.log(binaire);
        var min=Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
    var max=Math.max.apply(null,this.list_OnlyValues_byNomIndicateur);
       var arr;
    var mc;
    var diss_standarise5;
    var restevirgule=0;

    //cas diss a gauche 
    console.log('diss a gauche');      
    if(min==0){
    arr = this.list_OnlyValues_byNomIndicateur.filter(function(item) { 
       return item !== 0
     
   })
   mc=Math.min.apply(null,arr);
 }
    else {mc=min;}
    var  r=Math.pow(10, (Math.log10(max)-Math.log10(mc))/5);
    if(this.infoIndicateur[0].type==='brute'){
      diss_standarise5=[[min,Math.trunc(mc*r)],[Math.trunc(mc*r),Math.trunc(mc*Math.pow(r,2))],[Math.trunc(mc*Math.pow(r,2)),Math.trunc(mc*Math.pow(r,3))],[Math.trunc(mc*Math.pow(r,3)),Math.trunc(mc*Math.pow(r,4))],[Math.trunc(mc*Math.pow(r,4)),max]];
    }
    else{
 diss_standarise5=[[min,Math.trunc(mc*r*1000)/1000],[Math.trunc(mc*r*1000)/1000,Math.trunc(mc*Math.pow(r,2)*1000)/1000],[Math.trunc(mc*Math.pow(r,2)*1000)/1000,Math.trunc(mc*Math.pow(r,3)*1000)/1000],[Math.trunc(mc*Math.pow(r,3)*1000)/1000,Math.trunc(mc*Math.pow(r,4)*1000)/1000],[Math.trunc(mc*Math.pow(r,4)*1000)/1000,Math.trunc(max*1000)/1000]];
    }
        console.log('this is mc');
         this.legendData[this.dropdownIndicateur]={};
    this.legendData[this.dropdownIndicateur]['progression geométrique à gauche'] =diss_standarise5; 
     //cas diss a droite 

    if(min==0){
      arr = this.list_OnlyValues_byNomIndicateur.filter(function(item) { 
         return item !== 0
       
     })
     mc=Math.min.apply(null,arr);
   }
      else {mc=min;}
      var  r=Math.pow(10, (Math.log10(max)-Math.log10(mc))/5);
               console.log('diss stan'+r+'------------'+mc);
     
                     diss_standarise5=[[min,mc+max-mc*Math.pow(r,4)],[mc+max-mc*Math.pow(r,4),mc+max-mc*Math.pow(r,3)],[mc+max-mc*Math.pow(r,3),mc+max-mc*Math.pow(r,2)],[mc+max-mc*Math.pow(r,2),mc+max-mc*r],[mc+max-mc*r,max]];

                console.log(diss_standarise5);
       //this.legendData[this.dropdownIndicateur] =diss_standarise5;    
         
       this.legendData[this.dropdownIndicateur]['progression geométrique à droite'] =diss_standarise5; 
  
          //cas symetrique
          console.log('list values');
          this.list_OnlyValues_byNomIndicateur.sort((a, b) => a - b);
       
          console.log(this.list_OnlyValues_byNomIndicateur);
          const reduce = (accumulator, currentValue) => accumulator + currentValue;
          var l=this.list_OnlyValues_byNomIndicateur.length-1;
          var l5=(this.list_OnlyValues_byNomIndicateur.length-1)/5;
          var qtl=[];
          for(var i=0;i<5;i++){
            qtl[i]=[this.list_OnlyValues_byNomIndicateur[Math.trunc(l5*i)],this.list_OnlyValues_byNomIndicateur[Math.trunc(l5*(i+1))]];
          }
var moy= this.list_OnlyValues_byNomIndicateur.reduce(reduce)/l;
     //console.log(this.list_OnlyValues_byNomIndicateur.sort((a, b) => a - b)    );
     var x=0;
     for(var i=0;i<this.list_OnlyValues_byNomIndicateur.length;i++){
      x=x+Math.pow(this.list_OnlyValues_byNomIndicateur[i]- moy,2)   }
 x=x/this.list_OnlyValues_byNomIndicateur.length;
    var g=Math.sqrt(x);
    console.log('ecart'+g+'moy'+moy);
    var diss_standarise=[[min,moy-1.5*x],[moy-1.5*x,moy-0.5*x],[moy-0.5*x,moy+0.5*x],[moy-0.5*x,moy+1.5*x],[moy+1.5*x,max]];
    this.legendData[this.dropdownIndicateur]['Quantile'] =qtl; 
  
//cas multimodale ou stable

var quantilles5=(Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/5;
    var division=[];
    var min= Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
    for(var i=0;i<5;i++){
     division[i]=[min+i*quantilles5,min+(i+1)*quantilles5];
    }
    console.log(division)
    this.legendData[this.dropdownIndicateur]['Equidistant'] =division; 
    this.legendData[this.dropdownIndicateur]['classification']='Quantile';
    console.log(this.legendData[this.dropdownIndicateur][this.legendData[this.dropdownIndicateur]['classification']]);
    console.log('here classification');
    console.log(this.legendData[this.dropdownIndicateur]  )  ;
    
   
        //this.legendData[this.dropdownIndicateur] =division;
        this.geti(this.dropdownIndicateur);


    

               if(mode<moyenne){
          if(changement==0 || (changement==1 && binaire[i]==1) )
         {
      console.log('diss a gauche');
        } 
         else{
          console.log('multimodale')
          this.quantille();
         }
          
        
        }
        else if(mode>moyenne){
          if(changement==0 || (changement==1)){
            console.log('diss a droite') 
         
        
        }
          else{
           console.log('multimodale')
           this.quantille();
          }
        }
        else if(mode===moyenne){
          if(changement==1){
            console.log('symetrique');

          }
          else{
            console.log('multimodale');
            this.quantille();
           }

        }
        else {
          console.log('multimodale ou stable')
          this.quantille();
   
        }
        // this.geti(this.dropdownIndicateur);


  }

  quantille(){
    var quantilles5=(Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/5;
    var division=[];
    var min= Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
    for(var i=0;i<5;i++){
     division[i]=[min+i*quantilles5,min+(i+1)*quantilles5];
    }
    console.log(division)
        this.legendData[this.dropdownIndicateur] =division;
        this.geti(this.dropdownIndicateur);
  }

  infoPut(){
  this.info = L.control();
    this.info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      
      this._div.style.padding=' 6px 8px';
      this._div.style.font=' 14px/16px Arial, Helvetica, sans-serif';
      this._div.style.background='white';
      this._div.style.background ='rgba(255,255,255,0.8)';
      this._div.style.boxshadow=' 0 0 15px rgba(0,0,0,0.2)';
      this._div.style.borderradius= '5px';
   
   
      this.update();
      return this._div;
  };
  this.info.update = function (props) {
  
    console.log(props);
    this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
        '<b>' + props.nomCommune + '</b><br />' + props.valeur 
        : 'flotter sur un indicateur');
        
};
this.info.update1 = function (props,y) {
  console.log(props);
  console.log(y);
  this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
      '<b>' + props.Nom_Commun + '</b><br />' + props[y]
      : 'flotter sur un indicateur');
      
};

this.info.addTo(this.map);

  }

  public highlightRow(indic) {
    this.selectedId = indic.id;
    this.circlemarkers._layers[indic.id].setStyle({
      weight: 5,
      fillColor: "orange",
      color: 'black',
      dashArray: '',
      fillOpacity: 0.7
    });
  }

  public disablehighlightRow(indic){
    this.selectedId = null;
    this.circlemarkers.resetStyle  (this.circlemarkers._layers[indic.id]);
    
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  ExportTOExcel()
{
  const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
 
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  /* save to file */
  XLSX.writeFile(wb, 'SheetJS.xlsx');
  
}

  toPDF(){
   console.log('topdf')
      var divContents = $("#dvContainer").html();
      var printWindow = window.open('', '', 'height=400,width=800');
      printWindow.document.write('<html><head><title>DIV Contents</title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(divContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
 
  }

  populateTable(){

   

    
    document.getElementById("solid").style.paddingTop = "0%";
    document.getElementById("solid").innerHTML = "";

    var labels =this.list_nom_communes;
    var data = [];
    this.displayedColumns.push(this.list_V_byNomIndicateur[0].indicateur.nom);

  if(this.list_V_byNomIndicateur[0].indicateur.nom in  elements_tableau[0]){
   
  }
  else


{
  
  for (var j = 0; j <this.list_Communes.length; j++){

var test=true;
  for (var i = 0; i <this.list_V_byNomIndicateur.length; i++){
        
    // console.log('index'+this.list_nom_communes.indexOf(this.list_V_byNomIndicateur[i].commune.nomC));
     if(this.list_V_byNomIndicateur[i].commune.id===this.list_Communes[j].id){
       //this.list_communesjson[0].properties.push();
      elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur.nom] =this.list_V_byNomIndicateur[i].valeur;
      data.push(this.list_V_byNomIndicateur[i].valeur);
      test=false;
    }

     
   }
  if(test){
    elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur.nom]='Pas de valeur';
    data.push(null);}


}


this.globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom] = data;}

 // this.globaldataChart.push(d);
//
 
  this.indicateurs_choisis.push(this.list_V_byNomIndicateur[0].indicateur.nom);
  this.indicateurs_choisis_chart.push(this.list_V_byNomIndicateur[0].indicateur.nom);
  $('#myChart').remove(); // this is my <canvas> element
  $('#graph-container').append('<canvas id="myChart"><canvas>');
    this.canvas = document.getElementById('myChart');

        this.ctx = this.canvas.getContext('2d');
        var chart = new Chart(this.ctx, {
          // The type of chart we want to create
          type: 'bar',
          data: {
              labels: labels,
              datasets: [
                {
                  label: this.list_V_byNomIndicateur[0].indicateur.nom ,
                  data: this.globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom],
                  backgroundColor: 'red'
                }]
          },
          options: {
            spanGaps: true,
            scales: {
              xAxes: [
                
                  {   
                      ticks: {
                        suggestedMin: 100000,
                        suggestedMax: 200000,
                          display: false
                      }
                  }
              ],
          },
            plugins: {
              zoom: {
                pan: {
                  sensitivity:0.0000000000001,
                  enabled: true,
                  mode: 'x'
                },
                zoom: {
                  sensitivity:0.0000000000000000000000000000000000000001, 
                  enabled: true,
                  mode: 'x'
                }
              }
            },
           
   
          hover: {
      
            onHover :function(clickEvt,evt) {
              var h=[];
              h.push(evt[0]);
    
              if(h[0]!==undefined){
                console.log(h[0]._model);
              console.log(h[0]._model.label);}
            }
           
          },
        
          onClick:function(clickEvt,activeElems) {
           // console.log(activeElems);
          }
         
        }
      });
     
    
      
   

  }

  

 
  populateMap(){
    var c=this;
    console.log('legendData');
    console.log(this.legendData);
   
    var v= this.legendData[this.dropdownIndicateur][this.legendData[this.dropdownIndicateur]['classification']];
    this.legendData[this.dropdownIndicateur]['type']=this.list_V_byNomIndicateur[0].indicateur.type;
    console.log(v);
  
    console.log('this is v');
    console.log(this.list_V_byNomIndicateur[0].indicateur.type);
    if(this.list_V_byNomIndicateur[0].indicateur.type==='calculable'){
      var degradecouleur=['#FFEDA0', '#FEB24C'  ,'#FC4E2A' , '#E31A1C'  ,'#800026'    ];
     this.legendData[this.dropdownIndicateur]['couleur']=degradecouleur;
      console.log('gg');
      console.log(this.legendData);
    var m=this.dropdownIndicateur;
    var f=0;
    this.polygones=L.geoJson(this.list_communesjson,{
      style: function(feature) {
        for (var i = 0; i < V_B_N.length; i++) {
          if (feature.properties.OBJECTID===V_B_N[i].commune.id){
            feature.properties[V_B_N[i].indicateur.nom ]=V_B_N[i].valeur;
            if(v[0][0]<= V_B_N[i].valeur &&  V_B_N[i].valeur<=v[0][1]){ 
              f++;
              return {

                fillColor:degradecouleur[0],
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
               };}
            for(var j=1;j<v.length;j++){
              if(v[j][0]<V_B_N[i].valeur &&  Math.trunc(V_B_N[i].valeur*1000)/1000 <=v[j][1]){ 
                /*console.log(j);
                console.log(degradecouleur[j]);*/
                return {

                  fillColor: degradecouleur[j],
                  weight: 1,
                  opacity: 1,
                  color: 'white',
                  dashArray: '3',
                  fillOpacity: 0.7
                 };}
                
            }
            
           //console.log('this is density');
          
           //console.log(V_B_N[i].commune.id )
 } }
    }, onEachFeature(feature, layer) {
    
      layer.on('mouseover', function (e) { 
        console.log('this is f'+f);
        //console.log(layer);
       /* layer.setStyle({
          weight: 5,
          color: 'blue',
          dashArray: '',
          fillOpacity: 0.7
        });*/
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
        console.log('properties-----------------');
        console.log(layer.feature.properties);
       // c.info.update(layer.feature.properties);
        c.info.update1(layer.feature.properties,m);
 
        });
        layer.on('mouseout', function (e) {
          //console.log('targeeet'+e.target)
         // c.polygones.resetStyle(e.target);
          c.info.update(); 
          });
          layer.on('click', function (e) {
            var latLngs = [e.target.getLatLng()];
            var markerBounds = L.latLngBounds(latLngs);
           c.map.fitBounds(markerBounds); 
            });  }
  })
  this.mapData[this.dropdownIndicateur]=this.polygones;
     this.mapData[this.dropdownIndicateur].addTo(this.map);

    

     

}


    
  
  else{this.couleur=this.getRandomColor();
    this.legendData[this.dropdownIndicateur]['couleur']=this.couleur;
    var dict = [];
 
    for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
      dict.push({
        type:   "Feature",
        properties: {"nomCommune":this.list_V_byNomIndicateur[i].commune.nomC,"valeur":this.list_V_byNomIndicateur[i].valeur,"idCommune":this.list_V_byNomIndicateur[i].commune.id},
        geometry:{"type": "Point", "coordinates": [this.list_V_byNomIndicateur[i].commune.longitude,this.list_V_byNomIndicateur[i].commune.latitude]}
    });}



   var proportionCercles=[3,6,12,24,48];
   console.log('this is v1');
    console.log(v);
  this.circlemarkers=L.geoJSON(dict, {
    pointToLayer: function (feature, latlng) {
      if(v[0][0]<=feature.properties.valeur && feature.properties.valeur<=v[0][1]){ 
        return L.circleMarker(latlng, 
        {      
          radius: proportionCercles[0],
        //fillColor: c.couleur,
        color: 'orange'});}
      for(var i=1;i<v.length;i++){
        if(v[i][0]<feature.properties.valeur && feature.properties.valeur<=v[i][1]){ 
          return L.circleMarker(latlng, 
          {      
            radius: proportionCercles[i],
          //fillColor: c.couleur,
          color: c.couleur});}
      }
       
    }, onEachFeature(feature, layer) {
    
      layer.on('mouseover', function (e) { 
        //console.log(layer);
        layer.setStyle({
          weight: 5,
          fillColor: "orange",
          color: 'blue',
          dashArray: '',
          fillOpacity: 0.7
        });
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
        
        c.info.update(layer.feature.properties);
 
        });
        layer.on('mouseout', function (e) {
          //console.log('targeeet'+e.target)
          c.circlemarkers.resetStyle(e.target);
          c.info.update(); 
          });
          layer.on('click', function (e) {
            var latLngs = [e.target.getLatLng()];
            var markerBounds = L.latLngBounds(latLngs);
           c.map.fitBounds(markerBounds); 
            });  }})

this.mapData[this.dropdownIndicateur]=this.circlemarkers;
     this.mapData[this.dropdownIndicateur].addTo(this.map);}
  
  
  


    /* var t=[];
      for (var p in this.circlemarkers._layers){
      var m={};
      m=this.circlemarkers._layers[p].feature.properties;
      var b={};
      b['id'] = parseInt(p);
      ;
      var food = Object.assign({}, m, b);
      t.push(food)  ; }
      this.dictTable=t;*/
     
  }

  changerClassification(x,y){
var c=this;
var v= this.legendData[y][x];
this.legendData[y]['classification']=x;
if(this.legendData[y]['type']==='calculable'){
  var degradecouleur=['#FFEDA0', '#FEB24C'  ,'#FC4E2A' , '#E31A1C'  ,'#800026'    ];
     
  c.mapData[y].eachLayer(function(featureInstanceLayer) {
   console.log('hello');
   console.log(featureInstanceLayer.feature.properties.valeur);
            if(v[0][0]<=featureInstanceLayer.feature.properties[y] && 
          featureInstanceLayer.feature.properties[y]<=v[0][1]){ 
           
{
   featureInstanceLayer.setStyle({
       fillColor: 'green',
       fillOpacity: 0.8,
       weight: 0.5
   });}}

   for(var j=1;j<v.length;j++){
     if(v[j][0]<featureInstanceLayer.feature.properties[y] &&  Math.trunc(featureInstanceLayer.feature.properties[y]*1000)/1000 <=v[j][1]){ 
   { featureInstanceLayer.setStyle({

     fillColor: degradecouleur[j],
     weight: 1,
     opacity: 1,
     color: 'white',
     dashArray: '3',
     fillOpacity: 0.7
   });}}
       
       
   }

});

}
else{
  var proportionCercles=[3,6,12,24,48];
  c.mapData[y].eachLayer(function(featureInstanceLayer) {
              if(v[0][0]<=featureInstanceLayer.feature.properties.valeur && 
           featureInstanceLayer.feature.properties.valeur<=v[0][1]){ 
            
 {
    featureInstanceLayer.setStyle({
      radius: proportionCercles[0],
      fillColor:'green',
     weight: 1,
     opacity: 1,
     color: 'white',
     dashArray: '3',
     fillOpacity: 0.7
    });}}
 
    for(var j=1;j<v.length;j++){
      if(v[j][0]<featureInstanceLayer.feature.properties.valeur &&  Math.trunc(featureInstanceLayer.feature.properties.valeur*1000)/1000 <=v[j][1]){ 
    { featureInstanceLayer.setStyle({
 
      radius: proportionCercles[j],
      fillColor:'blue',
     weight: 1,
     opacity: 1,
     color: 'white',
     dashArray: '3',
     fillOpacity: 0.7
    });}}
        
        
    }
 
 });

}



  }

  RemoveLayer(layer_to_remove){
   this.map.removeLayer( this.mapData[layer_to_remove]);
   delete this.mapData[layer_to_remove];
   delete this.legendData[layer_to_remove];
   this.indicateurs_choisis = this.indicateurs_choisis.filter(e => e !== layer_to_remove);
   this.indicateurs_choisis_chart = this.indicateurs_choisis_chart.filter(e => e !== layer_to_remove);
   this.displayedColumns=this.displayedColumns.filter(e => e !== layer_to_remove);
   if(this.indicateurs_choisis.length!=0){
     this.putchart(this.indicateurs_choisis[this.indicateurs_choisis.length-1]);
    
   }
   else{
    $('#myChart').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="myChart"><canvas>');
    document.getElementById("solid").style.paddingTop = "20%";
    document.getElementById("solid").innerHTML = "No Chart to display";
   }
  
  }
  toggleEditable(event,v) {
    if ( !event.target.checked ) {
      this.map.removeLayer( this.mapData[v]);
      this.displayedColumns=this.displayedColumns.filter(e => e !== v);
      //this.indicateurs_choisis = this.indicateurs_choisis.filter(e => e !== v);
      this.NotlegendData.push(v);
      this.indicateurs_choisis_chart = this.indicateurs_choisis_chart.filter(e => e !== v);
      if(this.indicateurs_choisis_chart.length!=0){
        this.putchart(this.indicateurs_choisis_chart[this.indicateurs_choisis_chart.length-1]);
       
      }
      else{
       $('#myChart').remove(); // this is my <canvas> element
       $('#graph-container').append('<canvas id="myChart"><canvas>');
       document.getElementById("solid").style.paddingTop = "20%";
       document.getElementById("solid").innerHTML = "No Chart to display";
      }
   }
   else{
    document.getElementById("solid").style.paddingTop = "0%";
    document.getElementById("solid").innerHTML = "";

    this.indicateurs_choisis_chart.push(v);
    this.mapData[v].addTo(this.map);
    this.displayedColumns.push(v);
    //this.indicateurs_choisis.push(v);
    this.NotlegendData=this.NotlegendData.filter(e => e !== v);
    this.putchart(v);
   }
}
  
   calcRadius(val) {

    var radius = Math.sqrt(val / Math.PI);
    return radius * .04;}


 

 myFunction() {
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

 
    
}


  
      
      
}







