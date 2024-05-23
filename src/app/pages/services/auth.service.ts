import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthServiceComponent {

  constructor(
    private http: HttpClient,
    private router: Router) {
  }


  getToken() {
    const formData = new FormData();
    formData.append('user_name', environment.USER_NAME);
    formData.append('password', environment.USER_PASS);
    return this.http.post<any>(`${environment.API_URL}/auth/login`, formData).pipe((
      map((data: any) => {
        sessionStorage.setItem(environment.TOKEN_NAME, data.token);
        return data;
      })
    ));
  }

  validAgent(rut: string, password: string){
    return this.http
      .get<any>(`${environment.API_URL}/portal-plus/rut/${rut}?password=${password}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME),
        },
      })
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  saveEmailAgent(email: string){
    return this.http
      .get<any>(`${environment.API_URL}/portal-plus/rut/${sessionStorage.getItem("rut_agente")}/email?email=${email}`, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem(environment.TOKEN_NAME),
        },
      })
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  isLoggedIn() {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
