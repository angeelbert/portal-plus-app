import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ObituarioServiceComponent } from '../services/obituario.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
//&import { PagosServiceComponent } from '../services/pagos.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-obituarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './obituarios.component.html',
  styleUrl: './obituarios.component.css'
})
export class ObituariosComponent implements OnInit {

  form: any;
  obituarios: any;
  showData: boolean = false;
  tipoBusqueda: string = '';
  showBotoneraParques: boolean = true;
  selectedPlace: string = '';
  codigoParque: string = '0';

  // Define propiedades para mantener el estado de los botones
  hoySeleccionado = false;
  mananaSeleccionado = false;
  pasadoMananaSeleccionado = false;

  private modalService = inject(NgbModal);
  closeResult = '';

  constructor(
    private obituarioService: ObituarioServiceComponent,
    private fb: FormBuilder,
  ){

  }

  ngOnInit(): void {
    sessionStorage.setItem("breadcums", "Obituarios");
    this.form = this.fb.group({
      rut: ['', [
        Validators.required, 
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(8)
      ]]
    });
  }

  buscarData(tipoBusqueda: string, codigoParque: string = '', placeName: string = ''){
    this.tipoBusqueda = tipoBusqueda;
    if(this.tipoBusqueda === 'parque'){
      this.buscarObituarios(codigoParque, 'today');
    }else if(this.tipoBusqueda === 'crematorio'){
      this.buscarObituariosCinerario('today');
    }else{
      this.buscarObituarios('11', 'today');
    }
    this.selectedPlace = placeName;
  }

  buscarByDay(day: string = ''){
    if(this.tipoBusqueda === 'parque'){
      this.buscarObituarios(this.codigoParque, day);
    }else if(this.tipoBusqueda === 'crematorio'){
      this.buscarObituariosCinerario(day);
    }else{
      this.buscarObituarios('11', day);
    }
  }

  buscarObituarios(codigoParque: string, stringDate: string = 'today' ){

    this.codigoParque = codigoParque;
    let fechaIni: string;
    let fechaFin: string;

    if(stringDate === 'today'){
      this.seleccionarHoy();
      fechaIni = this.getToday();
      fechaFin = this.getTomorrow();
    }else if(stringDate === 'tomorrow'){
      this.seleccionarManana();
      fechaIni = this.getTomorrow();
      fechaFin = this.getDayAfterTomorrow();
    }else if(stringDate === 'dayAfterTomorrow'){
      this.seleccionarPasadoManana();
      fechaIni = this.getDayAfterTomorrow();
      fechaFin = this.getDayAfterThreeDays();
    }else{
      fechaIni = this.getToday();
      fechaFin = this.getTomorrow();
    }

    /*fechaIni = '2020-01-01';
    fechaFin = '2024-04-24';*/

    this.obituarioService.getObituariosDataByRangeDayAndParkCode(fechaIni, fechaFin, codigoParque).subscribe((data) => {
      data.sort((a: any, b: any) => {
        return parseInt(a.a2) - parseInt(b.a2) ;// Ordenar alfabéticamente (por cadenas)
      });
      this.obituarios = data;
      this.showData = true;
      this.showBotoneraParques = false;
    })
  }

  buscarObituariosCinerario(stringDate: string = 'today' ){
    
    let fechaIni: string;
    let fechaFin: string;

    if(stringDate === 'today'){
      this.seleccionarHoy();
      fechaIni = this.getToday();
      fechaFin = this.getTomorrow();
    }else if(stringDate === 'tomorrow'){
      this.seleccionarManana();
      fechaIni = this.getTomorrow();
      fechaFin = this.getDayAfterTomorrow();
    }else if(stringDate === 'dayAfterTomorrow'){
      this.seleccionarPasadoManana();
      fechaIni = this.getDayAfterTomorrow();
      fechaFin = this.getDayAfterThreeDays();
    }else{
      this.seleccionarHoy();
      fechaIni = this.getToday();
      fechaFin = this.getTomorrow();
    }

    /*fechaIni = '2020-01-01';
    fechaFin = '2024-04-24';*/

    this.obituarioService.getObituariosCinerarioDataByRangeDay(fechaIni, fechaFin).subscribe((data) => {
      data.sort((a: any, b: any) => {
        return parseInt(a.a10) - parseInt(b.a10) // Ordenar alfabéticamente (por cadenas)
      });
      this.obituarios = data;  
      this.showData = true;
      this.showBotoneraParques = false;
    })
  }

  resetPage(){
    this.showData = false;
    this.showBotoneraParques = true;
    this.selectedPlace = '';
  }

  getToday(): string {
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: number = today.getMonth() + 1; // Los meses van de 0 a 11, por lo que se suma 1
    const day: number = today.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  getHourOrMinutes(hour: string){
    if(hour === '0'){
      return '00';
    }else if(hour === '1'){
      return '01';
    }else if(hour === '2'){
      return '02';
    }else if(hour === '3'){
      return '03';
    }else if(hour === '4'){
      return '04';
    }else if(hour === '5'){
      return '05';
    }else if(hour === '6'){
      return '06';
    }else if(hour === '7'){
      return '07';
    }else if(hour === '8'){
      return '08';
    }else if(hour === '9'){
      return '09';
    }
    return hour;
  }

  getTomorrow(): string {
    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year: number = tomorrow.getFullYear();
    const month: number = tomorrow.getMonth() + 1;
    const day: number = tomorrow.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  getDayAfterTomorrow(): string {
    const dayAfterTomorrow: Date = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const year: number = dayAfterTomorrow.getFullYear();
    const month: number = dayAfterTomorrow.getMonth() + 1;
    const day: number = dayAfterTomorrow.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
  getDayAfterThreeDays(): string {
    const dayAfterThreeDays: Date = new Date();
    dayAfterThreeDays.setDate(dayAfterThreeDays.getDate() + 3);
    const year: number = dayAfterThreeDays.getFullYear();
    const month: number = dayAfterThreeDays.getMonth() + 1;
    const day: number = dayAfterThreeDays.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  seleccionarHoy() {
    this.hoySeleccionado = true;
    this.mananaSeleccionado = false;
    this.pasadoMananaSeleccionado = false;
  }

  seleccionarManana() {
    this.hoySeleccionado = false;
    this.mananaSeleccionado = true;
    this.pasadoMananaSeleccionado = false;
  }

  seleccionarPasadoManana() {
    this.hoySeleccionado = false;
    this.mananaSeleccionado = false;
    this.pasadoMananaSeleccionado = true;
  }

}
