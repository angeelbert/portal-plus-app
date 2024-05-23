import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthServiceComponent } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private authService: AuthServiceComponent,
    private router: Router
  ) { }

  form: FormGroup = new FormGroup({
    username: new FormControl("",
    Validators.compose([Validators.required, Validators.minLength(4)])
    ),
    password: new FormControl("",
    Validators.compose([Validators.required])
    ),
  });


  @Input() error: string | null | undefined;

  @Output() submitEM = new EventEmitter();
  
  login() {
    if (this.form.valid) {
      this.authService.getToken().subscribe((data) => {
        sessionStorage.setItem("rut_agente", this.form.value.username);
        this.authService.validAgent(this.form.value.username, this.form.value.password).subscribe((data) => {
          if(data.primerLogin === true){
            this.router.navigate(['/login/primer-intento']);
          }else{
            sessionStorage.setItem('agente', JSON.stringify(data.agentes));
            sessionStorage.setItem('schema', JSON.stringify(data.schema));
            this.router.navigate(['/contratos']);
          }
        }, error => {
          Swal.fire({
            title: "Error!",
            text: "Lo sentimos!. Su usuario no registra los datos necesarios para conectarse. Por favor, comuníquese con el area de soporte de GNP.",
            icon: "error"
          })
        });
      })
      //this.submitEM.emit(this.form.value);
    }
  }
}
