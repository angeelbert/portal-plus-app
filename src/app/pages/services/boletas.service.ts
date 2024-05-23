import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class BoletasServiceComponent {

  constructor(
    private http: HttpClient) {
  }

  getBoletasByRut(rut: number) {
    return this.http
      .get<any>(`${environment.API_URL}/boleta/rut/${rut}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME) ,
        },
      })
      .pipe(
        map((boletas) => {
          return boletas;
        })
      );
  }
}
