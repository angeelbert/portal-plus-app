import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class PagosServiceComponent {

  constructor(
    private http: HttpClient) {
  }

  getPaymentByContract(numero: string, base: string, serie: string, schema: string) {
    return this.http
      .get<any>(`${environment.API_URL}/pagos?numero=${numero}&base=${base}&serie=${serie}`, {
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
