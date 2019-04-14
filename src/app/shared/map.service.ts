import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly rootURL ="http://localhost:9090/"

   constructor(private http : HttpClient) { }

   getall(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/all');
  }

  getNomIndicateur(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Indicateur/NomIndicateur');
  }

  getNomCommunes(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/NomCommunes');
  }

  getValeurByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/'+nom);
  }

  getOnlyValuesByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/AllValues/'+nom);
  }

  


 
}
