import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })

export class ResetTokenService {
  constructor(private http: HttpClient) {}

  enviarCorreo(correo: string) {
    return this.http.post<number>(`${environment.API_URL}/portal-plus/send/email?correo=${correo}`, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain').
      set('Authorization', "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME))
    });
  }

  verificarTokenReset(token: string) {  
    return this.http.get<number>(`${environment.API_URL}/portal-plus/restore/verify/${token}`, {
      headers: new HttpHeaders().set('Authorization', "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME))
    });
  }

  restablecer(token: string, clave: string) {
    return this.http.post<number>(`${environment.API_URL}/portal-plus/restore/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain').set('Authorization', "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME))
    });
  }

  updateProfile(data: any){
    return this.http.post<any>(`${environment.API_URL}/portal-plus/agent/update-profile`, data, {
      headers: new HttpHeaders().set('Authorization', "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME))
    });
  }
}
