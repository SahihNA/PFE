import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../shared/map.service';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import 'chartjs-plugin-zoom'
declare let L;
var legendData={};
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
  circlemarkers;
  public selectedId:any;
  couleur;
  dictTable:any[];
  globaldataChart={};
  list_nom_communes:any[];
  list_valeur_indicateur: any[];
  list_Nom_Indicateur:any[];
  list_V_byNomIndicateur:any[];
  list_OnlyValues_byNomIndicateur=[];
  indicateurs_choisis=[];
  dropdownIndicateur;
  dataSource = new MatTableDataSource([]);


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


  constructor(private service: MapService) { }

  ngOnInit() {
   
   
 
   
    $(window).click(function () {
      $('#test').css('background-color', 'red');
      });

   // this.drawLegend();

    this.service.getNomIndicateur().subscribe(
      (res) => {
        this.list_Nom_Indicateur = res;
        console.log(this.list_Nom_Indicateur);
      }/*,
      (err) => {
        alert("erreur lors de la get des Noms Indicateur");
      }*/
    );

    this.service. getNomCommunes().subscribe(
      (res) => {
        this.list_nom_communes = res;
        this.list_nom_communes.sort();
        this.displayedColumns.push('commune');
       
        for(var i=0;i<this.list_nom_communes.length;i++){
          elements_tableau[i]={};
         
         elements_tableau[i]["commune"] =this.list_nom_communes[i];
       // this.dataSource = elements_tableau;
        this.dataSource = new MatTableDataSource(elements_tableau);
        this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    
        }
       
      
        
       
       
      }/*,
      (err) => {
        alert("erreur lors de la get des Noms Indicateur");
      }*/
    );
    
   this.map = L.map('map').setView([32, -7], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

console.log(this.info);


this.infoPut();
 
       // this.get_products(map);
        
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
              label: data +' par commune',
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
        this.dropdownIndicateur=indic;
        this.list_OnlyValues_byNomIndicateur = res;
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
    
               if(mode<moyenne){
          if(changement==0 || (changement==1 && binaire[i]==1) )
         {console.log('diss a gauche');
         var quantilles5=(Math.max.apply(null,this.list_OnlyValues_byNomIndicateur )-Math.min.apply(null,this.list_OnlyValues_byNomIndicateur) )/5;
         var division=[];
         for(var i=0;i<5;i++){
          division[i]=[min+i*quantilles5,min+(i+1)*quantilles5];
         }
         console.log(division);
        
             legendData[this.dropdownIndicateur] =division;
           
 
             console.log('legendData'+legendData[this.dropdownIndicateur]);
             this.geti(this.dropdownIndicateur);
        } 
         else{
          console.log('multimodale')
         }
          
        
        }
        else if(mode>moyenne){
          if(changement==0 || (changement==1)){console.log('diss a droite') }
          else{
           console.log('multimodale')
          }
        }
        else if(mode===moyenne){
          if(changement==1){
            console.log('symetrique')
          }
          else{
            console.log('multimodale')
           }

        }
        else {
          console.log('multimodale ou stable')
        }

    
     

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
    this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">Commune/Indicateur</h7><br />' +  (props ?
        '<b>' + props.nomCommune + '</b><br />' + props.valeur 
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

  populateTable(){

   

    
    document.getElementById("solid").style.paddingTop = "0%";
    document.getElementById("solid").innerHTML = "";

    var labels =this.list_nom_communes;
    var data = [];
    this.displayedColumns.push(this.list_V_byNomIndicateur[0].indicateur);

  
for (var j = 0; j <this.list_nom_communes.length; j++){

var test=true;
  for (var i = 0; i <this.list_V_byNomIndicateur.length; i++){
        
    // console.log('index'+this.list_nom_communes.indexOf(this.list_V_byNomIndicateur[i].commune.nomC));
     if(this.list_V_byNomIndicateur[i].commune.nomC===this.list_nom_communes[j]){
      elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur] =this.list_V_byNomIndicateur[i].valeur;
      data.push(this.list_V_byNomIndicateur[i].valeur);
      test=false;
    }

     
   }
  if(test){
    elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur]='Pas de valeur';
    data.push(null);}


}


this.globaldataChart[this.list_V_byNomIndicateur[0].indicateur] = data;

 // this.globaldataChart.push(d);

 
  this.indicateurs_choisis.push(this.list_V_byNomIndicateur[0].indicateur);
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
                  label: this.list_V_byNomIndicateur[0].indicateur +' par commune',
                  data: data,
                  backgroundColor: 'red'
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
                  sensitivity:0.1, 
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
    this.couleur=this.getRandomColor();
    var dict = [];
 
    for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
      dict.push({
        type:   "Feature",
        properties: {"nomCommune":this.list_V_byNomIndicateur[i].commune.nomC,"valeur":this.list_V_byNomIndicateur[i].valeur},
        geometry:{"type": "Point", "coordinates": [this.list_V_byNomIndicateur[i].commune.x,this.list_V_byNomIndicateur[i].commune.y]}
    });}

    this.y(dict);
var c=this;

   
  var v=legendData[this.dropdownIndicateur];

  this.circlemarkers=L.geoJSON(dict, {
    pointToLayer: function (feature, latlng) {
      for(var i=0;i<v.length;i++){
        if(v[i][0]<feature.properties.valeur && feature.properties.valeur<v[i][1]){ return L.circleMarker(latlng, 
          {      
            radius: i*10,
          //fillColor: c.couleur,
          color: c.couleur});}
          
      }
     
       
    }, onEachFeature(feature, layer) {
    
      layer.on('mouseover', function (e) {
        
        console.log(layer);
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
          console.log('targeeet'+e.target)
          c.circlemarkers.resetStyle(e.target);
          c.info.update();
          
          });
          layer.on('click', function (e) {
            var latLngs = [e.target.getLatLng()];
            var markerBounds = L.latLngBounds(latLngs);
           c.map.fitBounds(markerBounds);
          
            
            });       
}

})
      this.circlemarkers.addTo(this.map);
     
     var t=[];
      for (var p in this.circlemarkers._layers){
     
      var m={};
      m=this.circlemarkers._layers[p].feature.properties;
      var b={};
      b['id'] = parseInt(p);
      ;
      var food = Object.assign({}, m, b);
      t.push(food)  ; }
      this.dictTable=t;

  }
  
   calcRadius(val) {

    var radius = Math.sqrt(val / Math.PI);
    return radius * .04;}


  drawLegend(data) {

    var largeDiameter = this.calcRadius(data.features[0].properties.GHG_QUANTITY) * 2,
    smallDiameter = largeDiameter/2;
    document.getElementById("legend").style.height = largeDiameter.toFixed();
  
   
   // $("#legend").css('height', largeDiameter.toFixed());
   document.getElementById("legend-large").style.height = largeDiameter.toFixed();
   document.getElementById("legend-large").style.height = largeDiameter.toFixed();
             

             /* $('#legend-small').css({
                  'width': smallDiameter.toFixed(),
                  'height': smallDiameter.toFixed(),
                  'top': largeDiameter - smallDiameter,
                  'left': smallDiameter/2
              })

              $("#legend-small-label").html((data.features[0].properties.GHG_QUANTITY/2).toLocaleString());

              $("#legend-small-label").css({
                  'top': smallDiameter - 8,
                  'left': largeDiameter + 30
              });

              $("<hr class='large'>").insertBefore("#legend-large-label")
              $("<hr class='small'>").insertBefore("#legend-small-label").css('top', largeDiameter - smallDiameter - 8);*/


    


}

 myFunction() {
  var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}


  y(dict){
    var array=[];
    var legend = L.control({position: 'bottomleft'});
    var nomIndic;
    for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
    array[i]=(this.list_V_byNomIndicateur[i].valeur);
  nomIndic=this.list_V_byNomIndicateur[i].indicateur;
  }
    var max=Math.max.apply(null,array);
    var min=Math.min.apply(null,array);
    console.log(max);
    console.log(array);
    var f=this;
     legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend'),
   
        grades = [min,max],
        labels = [],
        from, to;
        labels.push(nomIndic);
        labels.push('<button (click)=this.myFunction()>Try it</button><div id="myDIV"  This is my DIV element This is my DIV element.</div>')
      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
       
      if(grades[i]==100){
        labels.push(
          '<i style=" width: 10px;   height: 10px;   float: left;     border-radius:50%;    opacity: 0.7;background:' +f.couleur + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));}

          else {
            labels.push(
              '<i style=" width: 18px;   height: 18px;   float: left;     border-radius:50%;    opacity: 0.7;background:' +f.couleur + '"></i> ' +
              from + (to ? '&ndash;' + to : '+'));}
          }
   
      div.innerHTML = labels.join('<br>');
     // div.style.backgroundColor = 'rgba(255,255,255,0.8)';
   // div.style.color = '#555';
   
   
      return div;
    };
   
  
    legend.addTo(this.map);



      }
      
      
}







