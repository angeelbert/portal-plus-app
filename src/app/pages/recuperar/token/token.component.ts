import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ResetTokenService } from '../../services/reset-token.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-token',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  form: any;
  mensaje: string = '';
  error: string = '';
  rpta: number = 0;
  tokenValido: boolean = false;

  @Input() token!: string;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private resetTokenService: ResetTokenService) { }

  ngOnInit() {

    this.form = this.fb.group({
      password: [''],
      confirmPassword: ['']
    });
    if(this.token !== undefined){
      this.resetTokenService.verificarTokenReset(this.token).subscribe(data => {
        if(data === 1) {
          this.tokenValido = true;
        } else {
          this.tokenValido = false;
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        }
      });
    }
  }

  onSubmit() {
    if(this.form.value.password === this.form.value.confirmPassword){
      let clave: string = this.form.value.confirmPassword;
      this.resetTokenService.restablecer(this.token, clave).subscribe(data => {
        if (data === 1) {
          this.mensaje = 'Se cambio la contraseña';
  
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000);
        }
      });
    }
  }
}
