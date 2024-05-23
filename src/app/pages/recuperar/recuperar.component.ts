import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetTokenService } from '../services/reset-token.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenComponent } from "./token/token.component";
import { AuthServiceComponent } from '../services/auth.service';

@Component({
    selector: 'app-recuperar',
    standalone: true,
    templateUrl: './recuperar.component.html',
    styleUrls: ['./recuperar.component.css'],
    imports: [CommonModule, ReactiveFormsModule, TokenComponent]
})
export class RecuperarComponent implements OnInit {

  form: any;
  email: string = '';
  mensaje: string = '';
  error: string = '';
  porcentaje: number = 0;

  constructor(
    private authService: AuthServiceComponent,
    private resetTokenService: ResetTokenService,
    public route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: new FormControl(
        "",
        Validators.compose([Validators.required])
      )
    });
  }

  enviar() {
    this.porcentaje = 90;
    this.resetTokenService.enviarCorreo(this.form.value.email).subscribe(data => {
      if(data === 1) {
        this.mensaje = "Se enviaron las indicaciones al correo."
        this.error = "null"
        this.porcentaje = 100;
        this.router.navigate(['/login']);
      } else {
        this.error = "El usuario ingresado no existe";
        this.porcentaje = 0;
      }
    })
  }

}
