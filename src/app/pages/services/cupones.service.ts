import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class CuponesServiceComponent {

  constructor(
    private http: HttpClient) {
  }

  getCuponesPendientesByRutAndSchema(rut: string, limitE: number, limitF: number, schema: string) {
    console.log(rut, limitE, limitF, schema);
    return this.http
      .get<any>(`${environment.API_URL}/pagos/cupones-pendientes?rut=${rut}&limitE=${limitE}&limitF=${limitF}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME) ,
          "x-schema": schema
        },
      })
      .pipe(
        map((cupones) => {
          return cupones;
        })
      );
  }
  getCuponesFuturosByRutAndSchema(rut: string, limitE: number, limitF: number, schema: string) {
    console.log(rut, limitE, limitF, schema);
    return this.http
      .get<any>(`${environment.API_URL}/pagos/cupones-futuros?rut=${rut}&limitE=${limitE}&limitF=${limitF}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME) ,
          "x-schema": schema
        },
      })
      .pipe(
        map((cupones) => {
          return cupones;
        })
      );
  }
}
