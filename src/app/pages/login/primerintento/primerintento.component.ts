import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceComponent } from '../../services/auth.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-primerintento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './primerintento.component.html',
  styleUrl: './primerintento.component.css'
})
export class PrimerintentoComponent implements OnInit{
  

  form: any;
  email: string = '';
  mensaje: string = '';
  error: string = '';
  porcentaje: number = 0;

  constructor(
    private authService: AuthServiceComponent,
    private router: Router,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required, 
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ])
      )
    });
  }

  enviar() {
    if (this.form.valid) {
      this.authService.getToken().subscribe((data) => {
        this.authService.saveEmailAgent(this.form.value.email).subscribe((data) => {
          Swal.fire({
            title: "Validado!",
            text: "Se ha Validado satisfactoriamente el email ",
            icon: "success"
          })
          this.router.navigate(['/login']);
        }, error => {
          Swal.fire({
            title: "Error!",
            text: "Lo sentimos!. Su usuario no registra los datos necesarios para conectarse. Por favor, comuníquese con el area de servicios de GNP, correo mds@nuestrosparques.cl.",
            icon: "error"
          })
        });
      })
      //this.submitEM.emit(this.form.value);
    }
  }

}
