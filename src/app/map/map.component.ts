import { Component, OnInit } from '@angular/core';
import { MapService } from '../shared/map.service';
import { Chart } from 'angular-highcharts';
import * as CanvasJS from '../canvasjs.min';
declare let L;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',

  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  
  chart: Chart;
  couleur;
  list_valeur_indicateur: any[];
  list_Nom_Indicateur:any[];
  list_V_byNomIndicateur:any[];
  list:any[];
   myStyle = {
    "color": 'red',
    "weight": 5,
    "opacity": 0.65,
     fillColor: 'green',
};
map;
info;



  constructor(private service: MapService) { }

  ngOnInit() {
    
    
    

   // this.drawLegend();

    this.service.getNomIndicateur().subscribe(
      (res) => {
        this.list_Nom_Indicateur = res;
        console.log(this.list_Nom_Indicateur);
      },
      (err) => {
        alert("erreur lors de la get des Noms Indicateur");
      }
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

  putchart(){
    var databars=[];
    for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
      databars.push({
         y:this.list_V_byNomIndicateur[i].valeur, 
         label: this.list_V_byNomIndicateur[i].commune.nomC
                });

                
                ;}

    let chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Valeur Indicateur / commune"
      },
      axisX:{
        interval: 1
      },
      
      
      data: [{
        type: "bar",
		name: "companies",
		axisYType: "secondary",
		
        dataPoints: databars
      }]
    });
      
    chart.render();
   
  }

  getValeurByNomIndicateur(indic){
   console.log(this.info);
    console.log(indic);
    this.service.getValeurByNomIndicateur(indic).subscribe(
      (res) => {
        this.list_V_byNomIndicateur = res;
        this.populateMap();
        this.putchart();
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


  populateMap(){
    this.couleur=this.getRandomColor();
  
    var dict = [];
    var circlemarkers;

  
    for (var i = 0; i < this.list_V_byNomIndicateur.length; i++) {
      dict.push({
        type:   "Feature",
        properties: {"nomCommune":this.list_V_byNomIndicateur[i].commune.nomC,"valeur":this.list_V_byNomIndicateur[i].valeur},
        geometry:{"type": "Point", "coordinates": [this.list_V_byNomIndicateur[i].commune.x,this.list_V_byNomIndicateur[i].commune.y]}
    });}
   
    console.log(dict);
    this.y(dict);
var c=this;
console.log('here'+this);
    circlemarkers=L.geoJSON(dict, {
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
          
         console.log(layer.feature.properties);
          c.info.update(layer.feature.properties);
         
         console.log('wait'+c.info);
      
          });
          layer.on('mouseout', function (e) {
            circlemarkers.resetStyle(e.target);
            c.info.update();
            
            });
            layer.on('click', function (e) {
              var latLngs = [e.target.getLatLng()];
              var markerBounds = L.latLngBounds(latLngs);
             c.map.fitBounds(markerBounds);
            
              
              });
      
      
        
}
  
  })
      circlemarkers.addTo(this.map);
     


      
   
  
       
    


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




