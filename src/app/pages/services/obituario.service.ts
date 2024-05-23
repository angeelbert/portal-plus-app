import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ObituarioServiceComponent {

  constructor(
    private http: HttpClient) {
  }


  getObituariosDataByRangeDayAndParkCode(fechaInicio: string, fechaFin: string, codigoParque: string) {

    /*console.log('--- Consulta Parque ---');
    console.log('Fecha inicio: ' + fechaInicio);
    console.log('Fecha fin: ' +  fechaFin);
    console.log('Codigo Parque: ' +  codigoParque);*/

    return this.http
      .get<any>(`${environment.API_URL}/obituario?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&parque=${codigoParque}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME) ,
        },
      })
      .pipe(
        map((contracts) => {
          return contracts;
        })
      );
  }

  getObituariosCinerarioDataByRangeDay(fechaInicio: string, fechaFin: string) {

    /*console.log('--- Consulta Crematorio ---');
    console.log('Fecha inicio: ' + fechaInicio);
    console.log('Fecha fin: ' +  fechaFin);*/

    return this.http
      .get<any>(`${environment.API_URL}/obituario/crematorio?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME) ,
        },
      })
      .pipe(
        map((contracts) => {
          return contracts;
        })
      );
  }
}
