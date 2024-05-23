import { Component, OnInit } from '@angular/core';
import { AuthServiceComponent } from '../services/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { sin_foto_perfil } from '../../commons/perfil_sin_foto';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgbDropdownModule, NgbCollapseModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{
  
  breadcums: any;
  nombreAgente: any;
  foto: any;
  isCollapsed = true;

  ngOnInit(): void {
    this.breadcums = sessionStorage.getItem("breadcums");
    let agente = JSON.parse(sessionStorage.getItem('agente') || '{}');
    this.nombreAgente = agente.nombre + " " + agente.apellidoPaterno;
    if(agente.foto === "" || agente.foto === undefined || agente.foto === null){
      this.foto = sin_foto_perfil;
    }else{
      this.foto = agente.foto;
    }
  }

  constructor(
    private authService: AuthServiceComponent,
    private router: Router
  ){}

  logout(){
    this.authService.cerrarSesion();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
