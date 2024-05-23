import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResetTokenService } from '../services/reset-token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  form: any;
  showData: boolean = false;
  documentFile: any;

  constructor(
    private fb: FormBuilder,
    private updateProfileService: ResetTokenService
  ){

  }

  ngOnInit(): void {
    sessionStorage.setItem("breadcums", "Perfil agente");
    this.form = this.fb.group({
      rut: new FormControl(
        "",
        Validators.compose([Validators.required])
      )
    });
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    if(file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg'){
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.documentFile = reader.result;
      };
    }else{
      Swal.fire({
        title: "Error!",
        text: "Solo se aceptan imagenes ",
        icon: "error"
      })
    }
  }

  updatePhotoProfile(){
    let agente = JSON.parse(sessionStorage.getItem('agente') || '{}');
    let updateProfile = {
      documentFile: this.documentFile,
      rut: agente.rut,
      email: agente.correo
    };
    this.updateProfileService.updateProfile(updateProfile).subscribe((data) => {
      agente.foto = this.documentFile;
      sessionStorage.setItem('agente', JSON.stringify(agente));
      Swal.fire({
        title: "Actualizado!",
        text: "Se ha actualizado satisfactoriamente la foto de perfil del agente ",
        icon: "success"
      })
      window.location.reload();
    })
  }
}
