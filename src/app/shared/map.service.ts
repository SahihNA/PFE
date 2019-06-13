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
  getProvinces(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/Provinces');
  }

  getRegions(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/Regions');
  }

  getThemes(): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Indicateur/Themes');
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/communej.json");
}

public getJSONProvinces(): Observable<any> {
  return this.http.get("./assets/provincesj.json");
}
public getJSONRegions(): Observable<any> {
  return this.http.get("./assets/regjson1.json");
}

  getCommunes(codeprov): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/Communes/'+codeprov);
  }
   
  getProvincesByCodeRegion(codereg): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/Provinces/'+codereg);
  }
 
  getValeurByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/'+nom);
  }

  getValeurByNomIndicateurCodeprov(nom,codeprov): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/'+nom+'/'+codeprov);
  }

  getValeurProvincesByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'ValeurProv/'+nom);
  }

  getValeurRegionsByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'ValeurReg/'+nom);
  }

  getInfoIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Indicateur/'+nom);
  }

  getOnlyValuesByNomIndicateur(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/AllValues/'+nom);
  }

  getOnlyValuesByNomIndicateurCodeprov(nom,codeprov): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'Valeur/OnlyValues/'+nom+'/'+codeprov);
  }
  getOnlyValuesByNomIndicateurProvinces(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'ValeurProv/OnlyValues/'+nom);
  }
  getOnlyValuesByNomIndicateurRegions(nom): Observable<any> {
    return this.http.get<Observable<any>>(this.rootURL + 'ValeurReg/OnlyValues/'+nom);
  }
  getPdf(): Observable<any>{
return this.http.get<Observable<any>>(this.rootURL + 'Pdf');
  }

  


 
}
