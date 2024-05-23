import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ContractServiceComponent {

  constructor(
    private http: HttpClient) {
  }


  getContractsByRutForContract(rut: string, schema: string) {
    return this.http
      .get<any>(`${environment.API_URL}/contrato/contractPage?rut=${rut}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME) ,
          "x-schema": schema
        },
      })
      .pipe(
        map((contracts) => {
          return contracts;
        })
      );
  }

  getContractsByRutForPay(rut: string, schema: string) {
    return this.http
      .get<any>(`${environment.API_URL}/contrato/payPage?rut=${rut}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME) ,
          "x-schema": schema
        },
      })
      .pipe(
        map((contracts) => {
          return contracts;
        })
      );
  }
}
