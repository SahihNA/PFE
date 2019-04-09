import { Component, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../shared/map.service';
import * as Chart from 'chart.js';
import * as $ from 'jquery';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import 'chartjs-plugin-zoom'
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
  circlemarkers;
  public selectedId:any;
  couleur;
  dictTable:any[];
  globaldataChart={};
  list_nom_communes:any[];
  list_valeur_indicateur: any[];
  list_Nom_Indicateur:any[];
  list_V_byNomIndicateur:any[];
  indicateurs_choisis=[];
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
    //var data = [2137680, 6282693, 805566, 2568163, 598599, 3189284, 599112, 926340, 5548295, 11847685, 66445];
    
    //for (var i=0;i<1000;i++){data.push(i)}
    var labels =this.list_nom_communes;
   // var labels = ["Management", "Finance", "Human Resources", "Business Development and Marketing", "Information Technology", "Professional Development and Training", "Knowledge Management", "Logistics", "Support", "Business Services", "Other"];
    //var bgColor = ["#878BB6", "#FFEA88", "#FF8153", "#4ACAB4", "#c0504d", "#8064a2", "#772c2a", "#f2ab71", "#2ab881", "#4f81bd", "#2c4d75"];
    //for (var i=0;i<1000;i++){labels.push(i+'hh')}
      //var ctx = document.getElementById("myChart");
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
              data: this.globaldataChart[data]
             // backgroundColor: bgColor
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

  getValeurByNomIndicateur(indic){
   console.log(this.info);
    console.log(indic);
    this.service.getValeurByNomIndicateur(indic).subscribe(
      (res) => {
        this.list_V_byNomIndicateur = res;
        this.populateMap();
       // this.putchart();
        this.populateTable();
      },
      (err) => {
        alert("erreur lors de la get des incident");
      }
    );
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
    var rowInt=[];
    var valint=[];
    this.displayedColumns.push(this.list_V_byNomIndicateur[0].indicateur);

    var trow =  $('#myform tr').eq(0);
    
    trow.append('<td>'+this.list_V_byNomIndicateur[0].indicateur+'</td>');
   
 for (var i = 0; i <this.list_V_byNomIndicateur.length; i++){
        
      
  rowInt.push(this.list_nom_communes.indexOf(this.list_V_byNomIndicateur[i].commune.nomC));
  valint.push(this.list_V_byNomIndicateur[i].valeur);
 
}
var u=0;
for (var j = 0; j <this.list_nom_communes.length; j++){
  var trow =  $('#myform tr').eq(j+1);
  if(rowInt.includes(j))
  {

     
     
      elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur] =valint[u];
     
 
     
    trow.append(valint[u]);
    data.push(valint[u]);
    u++;

  }
  else{
    elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur]='Pas de valeur';
    trow.append('<td> Pas de valeur</td>');
    data.push(null);

  }

}
for (var j = 0; j <this.list_nom_communes.length; j++){
  console.log('elementhere' +elements_tableau[j][this.list_V_byNomIndicateur[0].indicateur]);
}

this.globaldataChart[this.list_V_byNomIndicateur[0].indicateur] = data;

 // this.globaldataChart.push(d);

  console.log('the map'+ this.globaldataChart[this.list_V_byNomIndicateur[0].indicateur]);
  this.indicateurs_choisis.push(this.list_V_byNomIndicateur[0].indicateur);

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
                  data: data
                 // backgroundColor: bgColor
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
  populateMap(){
    this.couleur=this.getRandomColor();
  
    var dict = [];
    //var circlemarkers;

    console.log('test'+this.list_V_byNomIndicateur)
    for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
      dict.push({
        type:   "Feature",
        properties: {"nomCommune":this.list_V_byNomIndicateur[i].commune.nomC,"valeur":this.list_V_byNomIndicateur[i].valeur},
        geometry:{"type": "Point", "coordinates": [this.list_V_byNomIndicateur[i].commune.x,this.list_V_byNomIndicateur[i].commune.y]}
    });}
   
    
    this.y(dict);
var c=this;
console.log('meee'+dict);
   this.circlemarkers=L.geoJSON(dict, {
      pointToLayer: function (feature, latlng) {
       
        console.log(feature.properties.valeur);
        if(feature.properties.valeur==100){ return L.circleMarker(latlng, 
          {      
            radius: 10,
          //fillColor: c.couleur,
          color: c.couleur});}
          else{
            return L.circleMarker(latlng, 
              {      
                radius: 20,
              //fillColor: c.couleur,
              color: c.couleur});
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
          
         console.log(layer.feature.properties);
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
      t.push(food)  ;

     
      console.log(this.circlemarkers._layers[p].feature.properties);
     
     
      }

      this.dictTable=t;
      console.log(t);
      console.log(this.dictTable);
     
     


      
   
  
       
    


  }
   calcRadius(val) {

    var radius = Math.sqrt(val / Math.PI);
    return radius * .04;

}


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
      div.style.backgroundColor = 'rgba(255,255,255,0.8)';
    div.style.color = '#555';
   
   
      return div;
    };
  
    legend.addTo(this.map);



      }

  



  

 

  





 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
  /* get_products(map) {
    this.service.getall().subscribe(
      (res) => {
        this.list_valeur_indicateur = res;
        this.markers(map);
      },
      (err) => {
        alert("erreur lors de la get des incident");
      }
    );
  }*/
 

 /* markers(map) {
    var m;
    var dict = [];
    var info = L.control();
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      //this._div =  document.querySelector(".info"); // create a div with a class "info"
      this._div.style.padding=' 6px 8px';
      this._div.style.font=' 14px/16px Arial, Helvetica, sans-serif';
      this._div.style.background='white';
      this._div.style.background ='rgba(255,255,255,0.8)';
      this._div.style.boxshadow=' 0 0 15px rgba(0,0,0,0.2)';
      this._div.style.borderradius= '5px';
   
   
      this.update();
      return this._div;
  };
  info.update = function (props) {
    console.log(props);
    this._div.innerHTML = '<h7 style=" margin: 0 0 5px; color: #777;font-weight: bold;">US Population Density</h7><br />' +  (props ?
        '<b>' + props.nomCommune + '</b><br />' + props.party + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
        
};

info.addTo(map);
    for (var i = 0; i < this.list_valeur_indicateur.length; i++) {
      dict.push({
        type:   "Feature",
        properties: {"nomCommune":this.list_valeur_indicateur[i].commune.nomC},
        geometry:{"type": "Point", "coordinates": [this.list_valeur_indicateur[i].commune.x, this.list_valeur_indicateur[i].commune.y]}
    });
  }
  
    console.log(dict);
    m=L.geoJSON(dict, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {radius: 10,
          fillColor: "white",
          color: "purple"});
    }, //onEachFeature: this.onEachFeature
    onEachFeature(feature, layer) {
      
        layer.on('mouseover', function (e) {
              
          console.log(e);
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
         
          info.update(layer.feature.properties);
          });
          layer.on('mouseout', function (e) {
            m.resetStyle(e.target);
            info.update();
            
            });
            layer.on('click', function (e) {
              var latLngs = [e.target.getLatLng()];
  var markerBounds = L.latLngBounds(latLngs);
  //map.fitBounds(markerBounds);
            
              
              });

      
      
        
}

})
    m.addTo(map);
    
    var legend = L.control({position: 'bottomright'});
     legend.onAdd = function (map) {
   
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [],
        from, to;
  
      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
  
        labels.push(
          '<i style=" width: 18px;   height: 18px;   float: left;   margin-right: 8px;     opacity: 0.7;background:' + 'blue' + '"></i> ' +
          from + (to ? '&ndash;' + to : '+'));
      }
 
      div.innerHTML = labels.join('<br>');
      div.style.backgroundColor = 'rgba(255,255,255,0.8)';
    div.style.color = '#555';
   
      return div;
    };
  
    legend.addTo(map);
    


  }*/

 
  
  

   
}




