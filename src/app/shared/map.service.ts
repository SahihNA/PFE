import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly rootURL ="http://localhost:9090/"

   constructor(private http : HttpClient) { 
    /* this.getJSON().subscribe(data => {
    console.log(data);});*/

}

   getall(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/all');
  }

  getNomIndicateur(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Indicateur/NomIndicateur');
  }

  getNomCommunes(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/NomCommunes');
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/communej.json");
}

public getJSONProvinces(): Observable<any> {
  return this.http.get("./assets/provincesj.json");
}
public getJSONRegions(): Observable<any> {
  return this.http.get("./assets/regionj.json");
}

  getCommunes(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/Communes');
  }

  getValeurByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/'+nom);
  }

  getInfoIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Indicateur/'+nom);
  }

  getOnlyValuesByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/AllValues/'+nom);
  }

  


 
}
