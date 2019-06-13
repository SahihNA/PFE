import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { MapService } from '../shared/map.service';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import * as esri from "esri-leaflet";
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import 'chartjs-plugin-zoom';
import * as XLSX from 'xlsx';
import '../../../node_modules/leaflet-easyprint/dist/bundle.js'
import '../../../node_modules/chartjs-plugin-piechart-outlabels/dist/chartjs-plugin-piechart-outlabels.js'
import '../../../node_modules/esri-leaflet/dist/esri-leaflet.js'
import '../../../node_modules/esri-leaflet/dist/esri-leaflet-debug.js'
import { Router } from '@angular/router';
var  Liste_regions=[];
var  list_nom_communes=[];
var  list_nom_provinces=[];
var  list_nom_regions=[];
var m=this;
var V_B_N;
declare let L;
var chartsToPrint=[];
var globaldataChart={};
var indicateurs_choisis_chart=[];
var displayedcol=[];
var dataHistogramme=[];
var division=[];
var  elements_tableau = [
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
  indic_choisis_chart=[];
  list_communesjson={};
  listcom_json=[];
  list_provincesjson={};
  listprov_json=[];
  list_regionjson={};
  listreg_json=[];
  circlemarkers;
  polygones;
  public selectedId:any;
  couleur;
  dictTable:any[];
  list_valeur_indicateur: any[];
  list_Nom_Indicateur:any[];
  list_Nom_Provinces:any[];
  list_Communes=[];
  list_V_byNomIndicateur:any[];
  list_OnlyValues_byNomIndicateur=[];
  indicateurs_choisis=[];
  decoupage_choisis=[];
  infoIndicateur=[];
  dropdownIndicateur;
  dataSource = new MatTableDataSource([]);
  legendData={};
  NotlegendData=[];
  arrcom=[];
  list_Regions=[];
  listProvincebyCode=[];
  decoupage;
  listTheme=[];

 
  mapData={};
  chart;
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


  constructor(private service: MapService,  public dialog: MatDialog) { }
  openDialog() {
    displayedcol=this.displayedColumns;
    const dialogRef = this.dialog.open(RapportMatDialogue);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  ngOnInit() {
   
    
    console.log(esri)
    $(window).click(function () {
      $('#test').css('background-color', 'red');
      });


   this.service.getJSON().subscribe(data => {
     this.list_communesjson=data.features;
   this.listcom_json=data.features;
  });

  this.service.getThemes().subscribe(data => {
    this.listTheme=data;

 });

  this.service.getJSONProvinces().subscribe(data => {
    this.list_provincesjson=data.features;
  this.listprov_json=data.features;
 });

 


  this.service.getProvinces().subscribe(
    (res) => {
      this.list_Nom_Provinces = res;
    }
  );

  this.service.getRegions().subscribe(
    (res) => {
      this.list_Regions = res;
      Liste_regions=res;
    }
  );


    this.service.getCommunes(431).subscribe(
      (res) => {
        this.list_Communes = res;
      }
    );
    
   this.map = L.map('map').setView([30, -7], 6);
   esri.basemapLayer("Topographic").addTo(this.map);

       /* L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
       // this.map.addLayer( markerClusters );*/
       
 this.service.getJSONRegions().subscribe(data => {
  this.list_regionjson=data.features;
this.listreg_json=data.features;

});

  /*L.easyPrint({
    title: 'My awesome print button',
    position: 'bottomright',
    sizeModes: ['A4Portrait', 'A4Landscape']
  }).addTo(this.map);*/

      
console.log(this.info);

this.infoPut();      
  }
 

  ShowHidden(x){
    
  this.decoupage=x;
    document.getElementById("dropProvince").style.visibility = "hidden";
   // document.getElementById("dropRegion").style.visibility = "hidden";
    if(x=='commune'){
      document.getElementById("dropProvince").style.visibility = "visible";
    }
    if(x=='province'){

      document.getElementById("dropProvince").style.visibility = "hidden";
      this.p(1);
    }
    if(x=='région'){
      this.p(1);
      document.getElementById("dropProvince").style.visibility = "hidden";
    }
   
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
  GetNomIndicateur(){
    this.service.getNomIndicateur().subscribe(
      (res) => {
        this.list_Nom_Indicateur = res;
        this.test1();
   
       // console.log(this.list_Nom_Indicateur);
      }/*,
      (err) => {
        alert("erreur lors de la get des Noms Indicateur");
      }*/
   );
  }
  p(x){
   
    this.decoupage_choisis=[];
    this.decoupage_choisis.push(this.decoupage);
    this.mapData=[];
    this.legendData=[];
    this.indicateurs_choisis = [];
    indicateurs_choisis_chart =[];
    this.indic_choisis_chart=[];
    this.NotlegendData=[];
    $('#myChart').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="myChart"><canvas>');
    document.getElementById("solid").style.paddingTop = "25%";
    document.getElementById("solid").innerHTML = "Sélectionnez un indicateur";

    var c=this;
    this.map.eachLayer(function (layer) {
      c.map.removeLayer(layer);
  });

  esri.basemapLayer("Topographic").addTo(this.map);


  this.arrcom=[];
    var json;


if(this.decoupage_choisis[0]=='commune'){

  this.service.getCommunes(x).subscribe(
    (res) => {
      this.list_Communes = res;
      for(var i=0;i<this.listcom_json.length;i++){
 
        if(this.list_communesjson[i].properties.Code_Provi==x){
     this.arrcom.push(this.list_communesjson[i]);
        }
       }
          var myStyle = {
            weight: 2,
                fillColor: "grey",
                color: 'black',
                dashArray: '',
                fillOpacity: 0.2
        };
        
        json= L.geoJSON(c.arrcom, {
            style: myStyle
        }).addTo(this.map); 
      
        this.map.fitBounds(json.getBounds());
        this.displayedColumns=[];
       elements_tableau=[];
        this.displayedColumns.push(this.decoupage_choisis[0]);
        var t=[];
         for(var i=0;i<c.arrcom.length;i++){
           elements_tableau[i]={};
          elements_tableau[i][this.decoupage_choisis[0]] =this.list_Communes[i].nomC;
          t.push(this.list_Communes[i].nomC);
        // this.dataSource = elements_tableau;
         this.dataSource = new MatTableDataSource(elements_tableau);
         this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      
         } 
         list_nom_communes=t;
         this.decoupage_choisis[1]=x;

        this.GetNomIndicateur();
    
    
    }
  );

}

if(this.decoupage_choisis[0]=='province'){

  var myStyle = {
    weight: 2,
        fillColor: "grey",
        color: 'black',
        dashArray: '',
        fillOpacity: 0.2
};

json= L.geoJSON(this.list_provincesjson, {
    style: myStyle
}).addTo(this.map);
//this.map.fitBounds(json.getBounds());
this.map.setView([32, -6], 7);
this.displayedColumns=[];
elements_tableau=[];
 this.displayedColumns.push(this.decoupage_choisis[0]);
 var t=[];
  for(var i=0;i<this.list_Nom_Provinces.length;i++){
    elements_tableau[i]={};
   elements_tableau[i][this.decoupage_choisis[0]] =this.list_Nom_Provinces[i].nomP;
   t.push(this.list_Nom_Provinces[i].nomP);
 // this.dataSource = elements_tableau;
  this.dataSource = new MatTableDataSource(elements_tableau);
  this.dataSource.paginator = this.paginator;
this.dataSource.sort = this.sort;

  } 
 
  list_nom_provinces=t;
  this.decoupage_choisis[1]=x;

 this.GetNomIndicateur();


}
if(this.decoupage_choisis[0]=='région'){

  var myStyle = {
    weight: 2,
        fillColor: "grey",
        color: 'black',
        dashArray: '',
        fillOpacity: 0.2
};

//this.listreg_json=data.features;
console.log(this.list_regionjson);
json= L.geoJSON(this.list_regionjson, {
    style: myStyle
}).addTo(this.map);
this.map.setView([30, -7], 6);
this.displayedColumns=[];
elements_tableau=[];
 this.displayedColumns.push(this.decoupage_choisis[0]);
 var t=[];
  for(var i=0;i< this.list_Regions.length;i++){
    elements_tableau[i]={};
   elements_tableau[i][this.decoupage_choisis[0]] = this.list_Regions[i].nomR;
   t.push( this.list_Regions[i].nomR);
 // this.dataSource = elements_tableau;
  this.dataSource = new MatTableDataSource(elements_tableau);
  this.dataSource.paginator = this.paginator;
this.dataSource.sort = this.sort;

  } 
 
  list_nom_regions=t;
  this.decoupage_choisis[1]=x;

 this.GetNomIndicateur();


}
 
 }



  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  putchart(data){
    console.log('here in put chart')
    console.log(data)
    var col;
    var labels;
    var degradecouleur=['#FFEDA0', '#FEB24C'  ,'#FC4E2A' , '#E31A1C'  ,'#800026'    ];
    var v= this.legendData[data][this.legendData[data]['classification']];
   
    if(this.legendData[data].type=='brute'){
      col=this.legendData[data].couleur;
          }
          else{
          var g=[];
          //here test
          for (var i = 0; i < globaldataChart[data].length; i++) {
            var t=true;
            for(var j=1;j<v.length;j++){
           
            if(v[j][0]<Math.trunc( globaldataChart[data][i]*1000)/1000 &&  Math.trunc( globaldataChart[data][i]*1000)/1000 <=v[j][1]){
              g[i]=degradecouleur[j];
              var t=false;
             }}
             if(t){
              g[i]=degradecouleur[0];
             }
          }
        col=g;}
    
   // else {col='orange'}
   console.log('col'+col)
   if(this.decoupage_choisis[0]=='commune'){
     labels=list_nom_communes;
   }
   if(this.decoupage_choisis[0]=='province'){
labels=list_nom_provinces;
   }
   if(this.decoupage_choisis[0]=='région'){
    labels=list_nom_regions;
       }
     
    //var bgColor = ["#878BB6", "#FFEA88", "#FF8153", "#4ACAB4", "#c0504d", "#8064a2", "#772c2a", "#f2ab71", "#2ab881", "#4f81bd", "#2c4d75"];
    $('#myChart').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="myChart"><canvas>');
      this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    var chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [
            {
              label: data ,
              data: globaldataChart[data],
              backgroundColor: col
            }]
      },
      options: {
       /* spanGaps: true,*/
        scales: {
          xAxes: [
              {
                gridLines: {
                  display:false
                }, 
                  ticks: {
                      display: false
                  }
              }
          ],
      },
       /* plugins: {
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
        },*/
       
  
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
    if(this.decoupage_choisis[0]=='commune'){
      this.service.getValeurByNomIndicateurCodeprov(indic,this.decoupage_choisis[1]).subscribe(
        (res) => {
        V_B_N=res;  
       /* for(var i=0;i<V_B_N.length;i++){
          V_B_N[i]=Math.trunc(V_B_N[i]*1000)/1000
          
        }*/
          this.list_V_byNomIndicateur = res;
          this.populateMap();
  this.populateTable();
        }
      );
    }
    else if(this.decoupage_choisis[0]=='province'){
      this.service.getValeurProvincesByNomIndicateur(indic).subscribe(
        (res) => {
        V_B_N=res;  
          this.list_V_byNomIndicateur = res;
          this.populateMap();
  
       this.populateTable();
        }
      );
    }
    else if(this.decoupage_choisis[0]=='région'){
      this.service.getValeurRegionsByNomIndicateur(indic).subscribe(
        (res) => {
        V_B_N=res;  
        
          this.list_V_byNomIndicateur = res;
          this.populateMap();
  
       this.populateTable();
        }
      );
    }
   
    
  }

  getValeurByNomIndicateur(indic){
    if(this.decoupage_choisis[0]=='commune'){
    this.service.getOnlyValuesByNomIndicateurCodeprov(indic,this.decoupage_choisis[1]).subscribe(
      (res) => {
        if (! (indic in this.mapData)){
          this.dropdownIndicateur=indic;

          this.list_OnlyValues_byNomIndicateur = res;
          this.getInfoIndicateur(indic);
          //this.CalculIntervalles();
        }

      }
);}
else if(this.decoupage_choisis[0]=='province'){
  this.service.getOnlyValuesByNomIndicateurProvinces(indic).subscribe(
    (res) => {
      if (! (indic in this.mapData)){
        this.dropdownIndicateur=indic;

        this.list_OnlyValues_byNomIndicateur = res;
        this.getInfoIndicateur(indic);
        //this.CalculIntervalles();
      }

    }
);
}

else if(this.decoupage_choisis[0]=='région'){
  this.service.getOnlyValuesByNomIndicateurRegions(indic).subscribe(
    (res) => {
      if (! (indic in this.mapData)){
        this.dropdownIndicateur=indic;

        this.list_OnlyValues_byNomIndicateur = res;
        this.getInfoIndicateur(indic);
        //this.CalculIntervalles();
      }

    }
);
}

   /* this.service.getOnlyValuesByNomIndicateur(indic).subscribe(
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
    );*/
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

  getHisogramme(indicNom){
   
 dataHistogramme= this.legendData[indicNom]['Histogramme'];
 division=this.legendData[indicNom]['Division'];
 this.openDialogHisto();
  }

  openDialogHisto(){
    const dialogRef = this.dialog.open(histogrammefrequence);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  CalculIntervalles(){
   
    console.log('this.list_OnlyValues_byNomIndicateur')
  
   this.list_OnlyValues_byNomIndicateur.sort((a, b) => a - b);
   console.log(this.list_OnlyValues_byNomIndicateur)
       var arraydivision8=[];
       var arraydivision4=[];
       var effectif=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
       var effectif4=[0,0,0,0,0,0,0,0];
       var moyenne=0;
       var mode=0;
      var m= (Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/64;
      var m4=(Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/8;
    console.log('m4'+m4)
  
      var n=Math.trunc(m);
      var n4=Math.trunc(m4);
      console.log(n4+'--------')
      var min=Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
      //debut array des intervalles
      for(var i=0;i<7;i++){
        arraydivision4.push([min,min+n4]);
        min=min+n4;
      }
      arraydivision4.push([min,Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )]);
      
      console.log('here array 4')
      console.log(arraydivision4);
      //fin array des intervalles
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
        //debut calcul effectif

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
//fin calcul effectif

    

      for(var i=0;i<this.list_OnlyValues_byNomIndicateur.length;i++){
       
        for(var j=1;j<arraydivision8.length;j++){
         
          if(arraydivision8[j][0]< this.list_OnlyValues_byNomIndicateur[i] && this.list_OnlyValues_byNomIndicateur[i]<=arraydivision8[j][1]){
                    effectif[j]=effectif[j]+1;
          }
                 
          }
      }

     
      const reducer = (accumulator, currentValue) => accumulator + currentValue;

      for(var j=0;j<arraydivision8.length;j++){
       
          moyenne+=(((arraydivision8[j][1]-arraydivision8[j][0])/2)*effectif[j]);
         
        }
       
        moyenne=moyenne/(effectif.reduce(reducer)); 
        var moyi=0;
        for(var j=0;j<arraydivision4.length;j++){
       
          moyi+=(((arraydivision4[j][1]-arraydivision4[j][0])/2)*effectif4[j]);
         
        }
       
        moyi=moyi/(effectif4.reduce(reducer));
        console.log('moyiii---------'+moyi);
        console.log('mediane-------'+arraydivision4[3][1]);

        console.log('moyenne---------'+moyenne);
        let d =effectif4.indexOf(Math.max.apply(null,effectif4));
       
        console.log(d)
        mode=(arraydivision4[d][1]-arraydivision4[d][0])/2;
        console.log('this is mode----------- '+mode)
        var binaire=[];
        var k=0;
        for(var i=0;i<effectif4.length-1;i++){
          if(effectif4[i]<effectif4[i+1]){binaire[k]=1; k++;}
          else if(effectif4[i]>effectif4[i+1]) {binaire[k]=0; k++;}

        }
        console.log('here effectif 4')
        console.log(effectif4)
        var changement=0;
    
        for(var i=0;i<binaire.length-1;i++){
          if(binaire[i]!=binaire[i+1]){changement=changement+1}
         

        }
        console.log(changement);
        console.log(binaire);
var sumEffectif=effectif4.reduce(reducer);
console.log(sumEffectif);
var histoFrequence=[];
for(var i=0;i<effectif4.length;i++){
 histoFrequence[i]=(effectif4[i]/sumEffectif)*100

}
console.log(histoFrequence);

        var min=Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
    var max=Math.max.apply(null,this.list_OnlyValues_byNomIndicateur);
       var arr;
    var mc;
    var diss_standarise5;
    var restevirgule=0;

    //debut cas diss a gauche 
        
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
 diss_standarise5=[[Math.trunc(min*1000)/1000,Math.trunc(mc*r*1000)/1000],[Math.trunc(mc*r*1000)/1000,Math.trunc(mc*Math.pow(r,2)*1000)/1000],[Math.trunc(mc*Math.pow(r,2)*1000)/1000,Math.trunc(mc*Math.pow(r,3)*1000)/1000],[Math.trunc(mc*Math.pow(r,3)*1000)/1000,Math.trunc(mc*Math.pow(r,4)*1000)/1000],[Math.trunc(mc*Math.pow(r,4)*1000)/1000,Math.trunc(max*1000)/1000]];
    }
        console.log('this is mc');
         this.legendData[this.dropdownIndicateur]={};
    this.legendData[this.dropdownIndicateur]['progression geométrique à gauche'] =diss_standarise5; 
    //fin progression geom a gauche
    
    
    //debut cas diss a droite 

    if(min==0){
      arr = this.list_OnlyValues_byNomIndicateur.filter(function(item) { 
         return item !== 0
       
     })
     mc=Math.min.apply(null,arr);
   }
      else {mc=min;}
    
      var  r=Math.pow(10, (Math.log10(max)-Math.log10(mc))/5);
                       if(this.infoIndicateur[0].type==='brute'){
                        diss_standarise5=[[min,Math.trunc(mc+max-mc*Math.pow(r,4))],[Math.trunc(mc+max-mc*Math.pow(r,4)),Math.trunc(mc+max-mc*Math.pow(r,3))],[mc+max-mc*Math.trunc(Math.pow(r,3)),Math.trunc(mc+max-mc*Math.pow(r,2))],[Math.trunc(mc+max-mc*Math.pow(r,2)),Math.trunc(mc+max-mc*r)],[Math.trunc(mc+max-mc*r),max]];
                      }
                    else{
                 diss_standarise5=[[Math.trunc(min*1000)/1000,Math.trunc((mc+max-mc*Math.pow(r,4))*1000)/1000],[Math.trunc((mc+max-mc*Math.pow(r,4))*1000)/1000,Math.trunc((mc+max-mc*Math.pow(r,3))*1000)/1000],[Math.trunc((mc+max-mc*Math.pow(r,3))*1000)/1000,Math.trunc((mc+max-mc*Math.pow(r,2))*1000)/1000],[Math.trunc((mc+max-mc*Math.pow(r,2))*1000)/1000,Math.trunc((mc+max-mc*r)*1000)/1000],[Math.trunc((mc+max-mc*r)*1000)/1000,Math.trunc(max*1000)/1000]];
                    }
                 
                     console.log('this prog a droite')
                console.log(diss_standarise5);
       //this.legendData[this.dropdownIndicateur] =diss_standarise5;    
         
       this.legendData[this.dropdownIndicateur]['progression geométrique à droite'] =diss_standarise5; 
  //fin prog geom a droite

       //debut quantile
          const reduce = (accumulator, currentValue) => accumulator + currentValue;
          var l=this.list_OnlyValues_byNomIndicateur.length-1;
          var l5=(this.list_OnlyValues_byNomIndicateur.length-1)/5;
          var qtl=[];
          if(this.infoIndicateur[0].type==='brute'){
          for(var i=0;i<5;i++){
            qtl[i]=[this.list_OnlyValues_byNomIndicateur[Math.trunc(l5*i)],this.list_OnlyValues_byNomIndicateur[Math.trunc(l5*(i+1))]];
          }}
          else{
             for(var i=0;i<5;i++){
              var t=Math.trunc(this.list_OnlyValues_byNomIndicateur[Math.trunc(l5*i)]*1000)/1000;
              var t1=Math.trunc(this.list_OnlyValues_byNomIndicateur[Math.trunc(l5*(i+1))]*1000)/1000;
              qtl[i]=[t,t1];
                    }
          }
var moy= this.list_OnlyValues_byNomIndicateur.reduce(reduce)/l;
   console.log(qtl)
     this.legendData[this.dropdownIndicateur]['Quantile'] =qtl; 
  //fin quantile
//debut cas equidistant

var quantilles5=(Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/5;
    var division=[];
    var min= Math.min.apply(null,this.list_OnlyValues_byNomIndicateur);
    for(var i=0;i<5;i++){
     division[i]=[Math.trunc((min+i*quantilles5)*1000)/1000,Math.trunc((min+(i+1)*quantilles5)*1000)/1000];
    }

    console.log(division)
    this.legendData[this.dropdownIndicateur]['Equidistant'] =division; 

    //fin cas equidistant
    this.legendData[this.dropdownIndicateur]['classification']='Quantile';
    this.legendData[this.dropdownIndicateur]['Histogramme']=histoFrequence;
    this.legendData[this.dropdownIndicateur]['Division']=arraydivision4;

   // console.log(this.legendData[this.dropdownIndicateur][this.legendData[this.dropdownIndicateur]['classification']]);
    
   console.log('here classification');
    console.log(this.legendData[this.dropdownIndicateur]  )  ;

    //test ecart type
   /* var x=0;
    for(var i=0;i<this.list_OnlyValues_byNomIndicateur.length;i++){
     x=x+Math.pow(this.list_OnlyValues_byNomIndicateur[i]- moy,2)   }
x=x/this.list_OnlyValues_byNomIndicateur.length;
   var g=Math.sqrt(x);
   console.log('ecart'+g+'moy'+moy);
   var diss_standarise=[[min,moy-1.5*x],[moy-1.5*x,moy-0.5*x],[moy-0.5*x,moy+0.5*x],[moy-0.5*x,moy+1.5*x],[moy+1.5*x,max]];
  */
    
   
        this.geti(this.dropdownIndicateur);

               if(mode<moyenne){
          if(changement==0 || (changement==1 && binaire[i]==1) )
         {
      console.log('diss a gauche');
  
        } 
         else{
          console.log('multimodale')
      
         }
          
        
        }
        else if(mode>moyenne){
          if(changement==0 || (changement==1)){
            console.log('diss a droite') 
         
        
        }
          else{
           console.log('multimodale')
          
          }
        }
        else if(mode===moyenne){
          if(changement==1){
            console.log('symetrique');

          }
          else{
            console.log('multimodale');
            
           }

        }
        else {
          console.log('multimodale ou stable')
         
        }
        // this.geti(this.dropdownIndicateur);


  }
  test1(){
    $('#bull').css({"visibility": "visible" , "opacity":"1"});
    $('#indic').hover(()=>{
      $('#bull').css({"visibility": "hidden", "opacity":"0"});
    })
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
  var c=this;
    this.info.update = function (props) {
      if(c.decoupage_choisis[0]=='commune'){
      this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
          '<b>' + props.nomCommune + '</b><br />' + props.valeur 
          : 'flotter sur un indicateur');
          
  }
  if(c.decoupage_choisis[0]=='province'){
   
    this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
        '<b>' + props.nomProvince + '</b><br />' + props.valeur 
        : 'flotter sur un indicateur');
        
}
if(c.decoupage_choisis[0]=='région'){
  
  this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
      '<b>' + props.nomRegion + '</b><br />' + props.valeur 
      : 'flotter sur un indicateur');
      
}
else{
  this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
    '<b>' + props.nomCommune + '</b><br />' + props.valeur 
    : 'flotter sur un indicateur');
}


};
  this.info.update1 = function (props,y) {
    if(c.decoupage_choisis[0]=='région'){
  
      this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
          '<b>' + props.nomregion + '</b><br />' + props[y] 
          : 'flotter sur un indicateur');
          
    }
    else{this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Indicateur</h7><br />' +  (props ?
      '<b>' + props.Nom_Commun + '</b><br />' + props[y]
      : 'flotter sur un indicateur');}
    
        
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
      var divContents = $("#url").html();
      console.log(divContents);
      var printWindow = window.open('', '', 'height=400,width=800');
      printWindow.document.write('<html><head><title>DIV Contents</title>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(divContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
 
  }

  populateTable(){
    var degradecouleur=['#FFEDA0', '#FEB24C'  ,'#FC4E2A' , '#E31A1C'  ,'#800026'    ];
    var v= this.legendData[this.dropdownIndicateur][this.legendData[this.dropdownIndicateur]['classification']];
    document.getElementById("solid").style.paddingTop = "0%";
    document.getElementById("solid").innerHTML = "";
   var labels;
    var data = [];
    for (var j = 0; j <this.list_V_byNomIndicateur.length; j++){ 
      this.list_V_byNomIndicateur[j].valeur=Math.trunc(this.list_V_byNomIndicateur[j].valeur*1000)/1000}
    this.displayedColumns.push(this.list_V_byNomIndicateur[0].indicateur.nom);

  if(this.list_V_byNomIndicateur[0].indicateur.nom in  elements_tableau[0]){
    if(this.decoupage_choisis[0]=='commune'){
    labels =list_nom_communes;}
    if(this.decoupage_choisis[0]=='province'){
      labels =list_nom_provinces;}
      if(this.decoupage_choisis[0]=='région'){
        labels =list_nom_regions;}
  }
  else
{ 
  if(this.decoupage_choisis[0]=='commune'){
  labels =list_nom_communes;
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
}}
if(this.decoupage_choisis[0]=='province'){
   labels =list_nom_provinces;
  for (var j = 0; j < this.list_Nom_Provinces.length; j++){ 
  var test=true;
  for (var i = 0; i <this.list_V_byNomIndicateur.length; i++){
        
    // console.log('index'+this.list_nom_communes.indexOf(this.list_V_byNomIndicateur[i].commune.nomC));
     if(this.list_V_byNomIndicateur[i].province.id=== this.list_Nom_Provinces[j].id){
       //this.list_communesjson[0].properties.push();
      elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur.nom] =this.list_V_byNomIndicateur[i].valeur;
      data.push(this.list_V_byNomIndicateur[i].valeur);
      test=false;
    }
  
   }
  if(test){
    elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur.nom]='Pas de valeur';
    data.push(null);}
}}

if(this.decoupage_choisis[0]=='région'){
  labels =list_nom_regions;
  for (var j = 0; j < this.list_Regions.length; j++){ 
  var test=true;
  for (var i = 0; i <this.list_V_byNomIndicateur.length; i++){
        
    // console.log('index'+this.list_nom_communes.indexOf(this.list_V_byNomIndicateur[i].commune.nomC));
     if(this.list_V_byNomIndicateur[i].region.id=== this.list_Regions[j].id){
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
}


globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom] = data;}
  this.indicateurs_choisis.push(this.list_V_byNomIndicateur[0].indicateur.nom);
  indicateurs_choisis_chart.push(this.list_V_byNomIndicateur[0].indicateur.nom);
  this.indic_choisis_chart.push(this.list_V_byNomIndicateur[0].indicateur.nom);
 
  $('#myChart').remove(); 
  var col;
  $('#graph-container').append('<canvas id="myChart"><canvas>');
    this.canvas = document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');
        if(this.legendData[this.list_V_byNomIndicateur[0].indicateur.nom].type=='brute'){
          col=this.legendData[this.list_V_byNomIndicateur[0].indicateur.nom].couleur;
              }
              else{
              var g=[];
              //here test
              for (var i = 0; i < globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom].length; i++) {
                var t=true;
                for(var j=1;j<v.length;j++){
               
                if(v[j][0]<Math.trunc( globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom][i]*1000)/1000 &&  Math.trunc( globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom][i]*1000)/1000 <=v[j][1]){
                  g[i]=degradecouleur[j];
                  var t=false;
                 }}
                 if(t){
                  g[i]=degradecouleur[0];
                 }
              }
            col=g;}
             // fin test
             
             /*     else {col=['red','blue']
               // 'orange'
              }*/
              console.log('here')
        console.log(globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom])
        this.chart = new Chart(this.ctx, {
          // The type of chart we want to create
          type: 'bar',
          data: {
              labels: labels,
              datasets: [
                {
                  label: this.list_V_byNomIndicateur[0].indicateur.nom ,
                  data: globaldataChart[this.list_V_byNomIndicateur[0].indicateur.nom],   
                  backgroundColor: col
                }]
          },
          options: {
           /* spanGaps: true,*/
            scales: {
              /*yAxes:[{
               
                gridLines: {
                  display:false,
                  
                }
            }],*/
              xAxes: [
                  { 
                    gridLines: {
                      display:false
                    },  
                      ticks: {
                       
                          display: false
                      }
                  }
              ],
          },
           /* plugins: {
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
            },*/
           
   
          /*hover: {
      
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
          }*/
         
          }
      });

  }

 
  done(){
  
      var lineChartData = {
        labels : ["January","February","March","April","May","June","July"],
        datasets : [
          {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,59,90,81,56,55,40],
            bezierCurve : false
          }
        ]
        
      }
    //this.ctx = this.canvas.getContext('2d');
    var myLine = new Chart(this.ctx,{
      data:lineChartData,
      type:"bar",
      
    });
    
   
    var url=myLine.toBase64Image();
    var iDiv=document.getElementById("url");
    //.innerHTML='<img src="'+url+'" />';
    for(var i=0;i<Object.keys(globaldataChart).length;i++){
      
      if(indicateurs_choisis_chart.indexOf(Object.keys(globaldataChart)[i]) > -1){
        
      //console.log( this.globaldataChart[Object.keys(this.globaldataChart)[i]]);
      var innerDiv = document.createElement('canvas');
      innerDiv.id = 'block-2'+i;
  
  // The variable iDiv is still good... Just append to it.
  iDiv.appendChild(innerDiv);
this.canvas = document.getElementById('block-2'+i);
  var context = this.canvas.getContext("2d");
  var chart = new Chart(context, {
    type: 'bar',
    data: {
        labels: list_nom_communes,
        datasets: [
          {
            label: Object.keys(globaldataChart)[i] ,
            data: globaldataChart[Object.keys(globaldataChart)[i]],
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
console.log(chart);
chartsToPrint.push(chart);

      }

  //innerDiv.innerHTML = "I'm the inner div";
      }
      var btn = document.createElement('button');
      btn.id = 'block';
  
  // The variable iDiv is still good... Just append to it.
  iDiv.appendChild(btn);
document.getElementById("block").innerHTML='hello';
 

  }
  

 
  populateMap(){
    var c=this;
       var v= this.legendData[this.dropdownIndicateur][this.legendData[this.dropdownIndicateur]['classification']];
    this.legendData[this.dropdownIndicateur]['type']=this.list_V_byNomIndicateur[0].indicateur.type;
    var m=this.dropdownIndicateur;
     if(this.list_V_byNomIndicateur[0].indicateur.type==='calculable'){
      var degradecouleur=['#FFEDA0', '#FEB24C'  ,'#FC4E2A' , '#E31A1C'  ,'#800026'    ];
     this.legendData[this.dropdownIndicateur]['couleur']=degradecouleur;
   
    var f=0;
    if(this.decoupage_choisis[0]=='commune'){
    this.polygones=L.geoJson(this.arrcom,{
      style: function(feature) {
        for (var i = 0; i < V_B_N.length; i++) {
          if (feature.properties.OBJECTID===V_B_N[i].commune.id){
            feature.properties[V_B_N[i].indicateur.nom ]=Math.trunc(V_B_N[i].valeur*1000)/1000;
            if(v[0][0]<=Math.trunc(V_B_N[i].valeur*1000)/1000 && Math.trunc(V_B_N[i].valeur*1000)/1000<=v[0][1]){ 
              f++;
              return {

                fillColor:degradecouleur[0],
                weight: 1,
                opacity: 1,
                color: 'black',
                fillOpacity: 0.8
               };}
            for(var j=1;j<v.length;j++){
              console.log(V_B_N[i])
              if(v[j][0]<Math.trunc(V_B_N[i].valeur*1000)/1000 &&  Math.trunc(V_B_N[i].valeur*1000)/1000 <=v[j][1]){ 
                /*console.log(j);
                console.log(degradecouleur[j]);*/
                return {

                  fillColor: degradecouleur[j],
                  weight: 1,
                  opacity: 1,
                  color: 'black',
                  fillOpacity: 0.8
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
         // layer.bringToFront();
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
  })}
  else if(this.decoupage_choisis[0]=='province'){
    this.polygones=L.geoJson(this.list_provincesjson,{
      style: function(feature) {
        for (var i = 0; i < V_B_N.length; i++) {
          if (feature.properties.OBJECTID===V_B_N[i].province.id) {
            feature.properties[V_B_N[i].indicateur.nom ]=Math.trunc(V_B_N[i].valeur*1000)/1000;
            if(v[0][0]<= V_B_N[i].valeur &&  V_B_N[i].valeur<=v[0][1]){ 
              f++;
              return {

                fillColor:degradecouleur[0],
                weight: 1,
                opacity: 1,
                color: 'black',
                  fillOpacity: 0.8
               };}
            for(var j=1;j<v.length;j++){
             
              if(v[j][0]<V_B_N[i].valeur &&  Math.trunc(V_B_N[i].valeur*1000)/1000 <=v[j][1]){ 
                /*console.log(j);
                console.log(degradecouleur[j]);*/
                return {

                  fillColor: degradecouleur[j],
                  weight: 1,
                  opacity: 1,
                  color: 'black',
                  fillOpacity: 0.8
                 };}
                
            }
        
 }
 
 

}
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
         // layer.bringToFront();
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
  }
  else if(this.decoupage_choisis[0]=='région'){
    console.log(this.list_regionjson);
    console.log(V_B_N);
    this.polygones=L.geoJson(this.list_regionjson,{
      style: function(feature) {
        for (var i = 0; i < V_B_N.length; i++) {
          if (feature.properties.gid===V_B_N[i].region.id) {
            feature.properties[V_B_N[i].indicateur.nom ]=Math.trunc(V_B_N[i].valeur*1000)/1000;
            if(v[0][0]<= V_B_N[i].valeur &&  Math.trunc(V_B_N[i].valeur*1000)/1000<=v[0][1]){ 
              f++;
              return {

                fillColor:degradecouleur[0],
                weight: 2,
                opacity: 1,
                color: 'black',
                
                fillOpacity: 0.8
               };}
            for(var j=1;j<v.length;j++){
              if(v[j][0]<V_B_N[i].valeur &&  Math.trunc(V_B_N[i].valeur*1000)/1000 <=v[j][1]){ 
                /*console.log(j);
                console.log(degradecouleur[j]);*/
                return {

                  fillColor: degradecouleur[j],
                  weight: 1,
                  opacity: 1,
                  color: 'black',
                  fillOpacity: 0.8
                 };}
                
            }
        
 }
 
 

}
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
         // layer.bringToFront();
        }
       // console.log('properties-----------------');
        //console.log(layer.feature.properties);
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
  }


  this.mapData[this.dropdownIndicateur]=this.polygones;
     this.mapData[this.dropdownIndicateur].addTo(this.map);

     

}

 
  else{this.couleur=this.getRandomColor();
    this.legendData[this.dropdownIndicateur]['couleur']=this.couleur;
    var dict = [];
    console.log('this is v1');
    console.log(v);
    console.log(this.list_V_byNomIndicateur);
 if(this.decoupage_choisis[0]=='commune'){
  for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
    dict.push({
      type:   "Feature",
      properties: {"nomCommune":this.list_V_byNomIndicateur[i].commune.nomC,"valeur":this.list_V_byNomIndicateur[i].valeur,"idCommune":this.list_V_byNomIndicateur[i].commune.id},
      geometry:{"type": "Point", "coordinates": [this.list_V_byNomIndicateur[i].commune.longitude,this.list_V_byNomIndicateur[i].commune.latitude]}
  });}
 }
 else if(this.decoupage_choisis[0]=='province'){
  for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
    dict.push({
      type:   "Feature",
      properties: {"nomProvince":this.list_V_byNomIndicateur[i].province.nomP,"valeur":this.list_V_byNomIndicateur[i].valeur,"idProvince":this.list_V_byNomIndicateur[i].province.id},
      geometry:{"type": "Point", "coordinates": [this.list_V_byNomIndicateur[i].province.longitude,this.list_V_byNomIndicateur[i].province.latitude]}
  });}

 }
 else if(this.decoupage_choisis[0]=='région'){
  for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
    dict.push({
      type:   "Feature",
      properties: {"nomRegion":this.list_V_byNomIndicateur[i].region.nomR,"valeur":this.list_V_byNomIndicateur[i].valeur,"idRegion":this.list_V_byNomIndicateur[i].region.id},
      geometry:{"type": "Point", "coordinates": [this.list_V_byNomIndicateur[i].region.longitude,this.list_V_byNomIndicateur[i].region.latitude]}
  });}

 }
    



   var proportionCercles=[5,10,20,30,40];
   
  this.circlemarkers=L.geoJSON(dict, {
    pointToLayer: function (feature, latlng) {
      if(v[0][0]<=feature.properties.valeur && feature.properties.valeur<=v[0][1]){ 
        return L.circleMarker(latlng, 
        {      
          radius: proportionCercles[0],
      fillColor: c.couleur,
     weight: 2,
     opacity: 0.5,
     color: 'black',
    // dashArray: '3',
     fillOpacity: 0.8});}
      for(var i=1;i<v.length;i++){
        if(v[i][0]<feature.properties.valeur && feature.properties.valeur<=v[i][1]){ 
          return L.circleMarker(latlng, 
          {      
            radius: proportionCercles[i],
            fillColor: c.couleur,
           weight: 2,
           opacity: 0.5,
           color: 'black',
           //dashArray: '3',
           fillOpacity: 0.8});}
      }
       
    }, onEachFeature(feature, layer) {
    
      layer.on('mouseover', function (e) { 
        //console.log(layer);
       /* layer.setStyle({
          weight: 5,
          fillColor: "orange",
          color: 'blue',
          dashArray: '',
          fillOpacity: 0.7
        });*/
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
        console.log(layer.feature.properties)
        c.info.update(layer.feature.properties);
        //c.info.update1(layer.feature.properties,m);
 
 
        });
        layer.on('mouseout', function (e) {
          console.log(e.target)
          //c.circlemarkers.resetStyle(e.target);
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
    console.log('changer classification')
    console.log(this.legendData)
var c=this;
var v= this.legendData[y][x];
this.legendData[y]['classification']=x;
if(this.legendData[y]['type']==='calculable'){
  var degradecouleur=['#FFEDA0', '#FEB24C'  ,'#FC4E2A' , '#E31A1C'  ,'#800026'    ];
     
  c.mapData[y].eachLayer(function(featureInstanceLayer) {
            if(v[0][0]<=Math.trunc(featureInstanceLayer.feature.properties[y]*1000)/1000 && 
              Math.trunc(featureInstanceLayer.feature.properties[y]*1000)/1000<=v[0][1]){ 
           
{
   featureInstanceLayer.setStyle({
       fillColor: degradecouleur[0],
       weight: 1,
       opacity: 1,
       color: 'black',
       fillOpacity: 0.8
   });}}

   for(var j=1;j<v.length;j++){
     if(v[j][0]<Math.trunc(featureInstanceLayer.feature.properties[y]*1000)/1000 &&  Math.trunc(featureInstanceLayer.feature.properties[y]*1000)/1000 <=v[j][1]){ 
   { featureInstanceLayer.setStyle({

     fillColor: degradecouleur[j],
     weight: 1,
     opacity: 1,
     color: 'black',
     fillOpacity: 0.8
   });}}
       
       
   }

});
}
else{
 
  var proportionCercles=[5,10,20,30,40];
  c.mapData[y].eachLayer(function(featureInstanceLayer) {
              if(v[0][0]<=featureInstanceLayer.feature.properties.valeur && 
           featureInstanceLayer.feature.properties.valeur<=v[0][1]){ 
            
 {
    featureInstanceLayer.setStyle({
      radius: proportionCercles[0],
      fillColor: c.legendData[y]['couleur'],
      weight: 2,
      
      color: 'black',
      fillOpacity: 0.8
    });}}
 
    for(var j=1;j<v.length;j++){
      if(v[j][0]<featureInstanceLayer.feature.properties.valeur &&  Math.trunc(featureInstanceLayer.feature.properties.valeur*1000)/1000 <=v[j][1]){ 
    { featureInstanceLayer.setStyle({
 
      radius: proportionCercles[j],
      fillColor: c.legendData[y]['couleur'],
      weight: 2,

      color: 'black',
     // dashArray: '3',
      fillOpacity: 0.8
    });}}
        
        
    }
 
 });

}
this.putchart(y);



  }

  RemoveLayer(layer_to_remove){
    this.NotlegendData=this.NotlegendData.filter(e => e !== layer_to_remove);
   this.map.removeLayer( this.mapData[layer_to_remove]);
   delete this.mapData[layer_to_remove];
   delete this.legendData[layer_to_remove];
   this.indicateurs_choisis = this.indicateurs_choisis.filter(e => e !== layer_to_remove);
   indicateurs_choisis_chart =indicateurs_choisis_chart.filter(e => e !== layer_to_remove);
   this.indic_choisis_chart=this.indic_choisis_chart.filter(e => e !== layer_to_remove);
   this.displayedColumns=this.displayedColumns.filter(e => e !== layer_to_remove);
   if(this.indicateurs_choisis.length!=0){
     this.putchart(this.indicateurs_choisis[this.indicateurs_choisis.length-1]);
    
   }
   else{
    $('#myChart').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="myChart"><canvas>');
    document.getElementById("solid").style.paddingTop = "25%";
    document.getElementById("solid").innerHTML = "Sélectionnez un indicateur";
   }
  
  }
  toggleEditable(event,v) {
    if ( !event.target.checked ) {
      this.map.removeLayer( this.mapData[v]);
      this.displayedColumns=this.displayedColumns.filter(e => e !== v);
      //this.indicateurs_choisis = this.indicateurs_choisis.filter(e => e !== v);
      this.NotlegendData.push(v);
      indicateurs_choisis_chart = indicateurs_choisis_chart.filter(e => e !== v);
      this.indic_choisis_chart = this.indic_choisis_chart.filter(e => e !== v);
      if(indicateurs_choisis_chart.length!=0){
        this.putchart(indicateurs_choisis_chart[indicateurs_choisis_chart.length-1]);
       
      }
      else{
       $('#myChart').remove(); // this is my <canvas> element
       $('#graph-container').append('<canvas id="myChart"><canvas>');
       document.getElementById("solid").style.paddingTop = "25%";
       document.getElementById("solid").innerHTML = "Sélectionnez un indicateur";
      }
   }
   else{
    document.getElementById("solid").style.paddingTop = "0%";
    document.getElementById("solid").innerHTML = "";

    indicateurs_choisis_chart.push(v);
    this.indic_choisis_chart.push(v);
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

@Component({
  selector: 'rapport-Mat-Dialogue',
  templateUrl: 'rapport-Mat-Dialogue.html',
})
export class RapportMatDialogue {
  list_RegVal=[];
   data=[];
 lab=[];
 i=0;
 NameIndic=[];
 
  constructor(private service: MapService){}
  
  ngOnInit() {
chartsToPrint=[];

    for(var i=0;i<Object.keys(globaldataChart).length;i++){
      this.lab=[];
     
         if(indicateurs_choisis_chart.indexOf(Object.keys(globaldataChart)[i]) > -1){
          this.NameIndic.push(Object.keys(globaldataChart)[i]);
    this.service.getValeurRegionsByNomIndicateur(Object.keys(globaldataChart)[i]).subscribe(
        (res) => {  
         
          this.data=[];
          this.lab=[];
          console.log(this.data)
  for (var m = 0; m <  Liste_regions.length; m++){ 
  var test=true;
  for (var n = 0; n <res.length; n++){
         if(res[n].region.id===  Liste_regions[m].id){
          this.lab.push(res[n].region.nomR+' '+res[n].valeur)
         this.data.push(res[n].valeur);
      test=false;
    }
  
   }
  if(test){
      this. data.push(null);}
}

  this.populateDialog(i);  }
      );  }
        }}
  populateDialog(i){
    
    var context;
    var iDiv=document.getElementById("rr");
    
       var innerDiv = document.createElement('canvas');
      innerDiv.id = 'block-2'+this.i;
     // innerDiv.style.cssText ='width:150px; height:300px'

      iDiv.appendChild(innerDiv);
      var canvas :any = document.getElementById('block-2'+this.i);
      this.i=this.i+1;
context = canvas.getContext("2d");
context.canvas.width = 800;
context.canvas.height =500;
context.canvas.align='center';
var chart = new Chart(context, {
  type: 'outlabeledPie',
  data: {
      labels: this.lab,
      datasets: [
        {
          label: Object.keys(globaldataChart)[i] ,
          data: this.data,
          backgroundColor:  [
            "#2ecc71",
            "#3498db",
            "#95a5a6",
            "#9b59b6",
            "#f1c40f",
            "#e74c3c",
            "#34495e",
            "#FF0000",
            "#2ecc71",
            "#3498db",
            "#95a5a6",
            "#808000",
            "#000080",
            "#A52A2A",
            "#BC8F8F",
            "#20B2AA"


          ],
        }]
  },
  options: {
    responsive: false,
 
    plugins: {
              legend: false,
              outlabels: {
                  text: '%l',
                  color: 'white',
                  stretch: 30,
                  font: {
                      resizable: true,
                      minSize: 12,
                      maxSize: 18
                  }
              }
          },
   
    scales: {
      xAxes: [
          {
              ticks: {
                  display: false
              }
          }
      ],
  }
}
});
chartsToPrint.push(chart);

 console.log(chartsToPrint);
 var name=this.NameIndic;
 
 setTimeout(function() {
   
    //var iDiv=document.getElementById("rr").innerHTML;
    document.getElementById("rr").innerHTML='<div>';
    
for(var i=0;i<chartsToPrint.length;i++){
        var url=chartsToPrint[i].toBase64Image();
        document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+'<p style="border: 2px solid #E29612;  font-weight: bold; text-align: center; width:800px;height:30px;"   >'+name[i]+'</p>';
     
        document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+'<img src="'+url+'" />';
      
      }
    
   
      
      var result = "<table align='center'>";
      result += "<tr>";
   
      for(var i=0; i<displayedcol.length; i++) {
        result += "<th>"+displayedcol[i]+"</th>";}
        result += "</tr>";
      for(var i=0; i<elements_tableau.length; i++) {
          result += "<tr>";
          for(var j=0; j<displayedcol.length; j++){
              result += "<td>"+elements_tableau[i][displayedcol[j]]+"</td>";
          }
          result += "</tr>";
      }
      result += "</table>";
      document.getElementById('tab').innerHTML=result;

      var tr = document.getElementById("tab");
var tds = tr.getElementsByTagName("td");
var ths = tr.getElementsByTagName("th");
for(var i = 0; i < ths.length; i++) {
  ths[i].style. padding='0.8em';
  ths[i].style.border='1px solid' ;
   ths[i].style.backgroundColor='grey';
}
 

for(var i = 0; i < tds.length; i++) {
   tds[i].style. padding='0.8em';
   tds[i].style.border='1px solid' ;

}

document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+document.getElementById('tab').innerHTML;
document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+'</div>';   
}, 1000); 

    
  }
  test(){
  
    //var iDiv=document.getElementById("rr").innerHTML;
    document.getElementById("rr").innerHTML='<div>';
    
for(var i=0;i<chartsToPrint.length;i++){
        var url=chartsToPrint[i].toBase64Image();
        document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+'<p style:"  font-weight: bold;" >'+this.NameIndic[i]+'</p>';
     
        document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+'<img src="'+url+'" />';
      
      }
    
   
      
      var result = "<table>";
      result += "<tr>";
   
      for(var i=0; i<displayedcol.length; i++) {
        result += "<th>"+displayedcol[i]+"</th>";}
        result += "</tr>";
      for(var i=0; i<elements_tableau.length; i++) {
          result += "<tr>";
          for(var j=0; j<displayedcol.length; j++){
              result += "<td>"+elements_tableau[i][displayedcol[j]]+"</td>";
          }
          result += "</tr>";
      }
      result += "</table>";
      document.getElementById('tab').innerHTML=result;

      var tr = document.getElementById("tab");
var tds = tr.getElementsByTagName("td");
var ths = tr.getElementsByTagName("th");
for(var i = 0; i < ths.length; i++) {
  ths[i].style.backgroundColor="#6699FF";
  ths[i].style.border='1px solid' ;

}
 

for(var i = 0; i < tds.length; i++) {
   tds[i].style. padding='0.8em';
   tds[i].style.border='1px solid' ;

}

document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+document.getElementById('tab').innerHTML;
document.getElementById("rr").innerHTML= document.getElementById("rr").innerHTML+'</div>';   
  
   
    
  }
  print(){
 
    console.log('element tableau')
    console.log(displayedcol)
    console.log(indicateurs_choisis_chart)
    var sTable = document.getElementById('tab').innerHTML;
    console.log(sTable)
    console.log('print')
    var divContents = $("#rr").html();
    console.log(divContents);
    var printWindow = window.open('', '', 'height=400,width=800');
    printWindow.document.write('<html><head><title>Rapport</title>');
    printWindow.document.write('</head><body >');

    printWindow.document.write(divContents);
    //printWindow.document.write(sTable);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
}


@Component({
  selector: 'histogrammefrequence',
  templateUrl: 'histogrammefrequence.html',
})
export class histogrammefrequence {
 
 
  constructor(private service: MapService,private router: Router){}
  
  ngOnInit() {
    for(var i = 0; i < division.length; i++) {
     division[i][0]=Math.trunc(division[i][0]*1000)/1000;
     division[i][1]=Math.trunc(division[i][1]*1000)/1000;
   
   }
   
  
    var context;
    var iDiv=document.getElementById("histogramme");
    
       var innerDiv = document.createElement('canvas');
      innerDiv.id = 'block-2';
     // innerDiv.style.cssText ='width:150px; height:300px'

      iDiv.appendChild(innerDiv);
      var canvas :any = document.getElementById('block-2');
     
context = canvas.getContext("2d");
context.canvas.width = 800;
context.canvas.height =300;
context.canvas.align='center';

var chart = new Chart(context, {
  type: 'bar',
  data: {
      labels: division,
      datasets: [
        
        {
          label: 'Frequence en (%)' ,
          data:dataHistogramme,
          fill: false,
         
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
           
         
          // Changes this dataset to become a line
          type: 'line'
      },
      {
        label: 'Frequence en (%)' ,
        data: dataHistogramme,
        backgroundColor:  [
          "#2ecc71",
          "#3498db",
          "#95a5a6",
          "#9b59b6",
          "#f1c40f",
          "#e74c3c",
          "#34495e",
          "#FF0000",
          "#2ecc71",
          "#3498db",
          "#95a5a6",
          "#808000",
          "#000080",
          "#A52A2A",
          "#BC8F8F",
          "#20B2AA"


        ],
      },
      
      
      ]
  },
 
  options: {
   
    legend: {
    	display: false
    },
    responsive: false, 
    scales: {
      xAxes: [
        {
            ticks: {
                display: true
            },  
            scaleLabel: {
               display: true,
               labelString: "Intervalles des valeurs de l'indicateur "
            }
        }
    ],
      yAxes: [{
        ticks: {
        
               min: 0,
               max: 100,
               callback: function(value){return value+ "%"}
            },  
            scaleLabel: {
               display: true,
               labelString: "Frequence en (%) "
            }
        }],
  }
}
});

          }
          Afficher_disscretisation(){
document.getElementById('progression géometrique gauche').style.display='block';
          }
          Afficher_Pdf_disscretisation(){
            this.router.navigate(['/dess']);
      
          }
        }
       






