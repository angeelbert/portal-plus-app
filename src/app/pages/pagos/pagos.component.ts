import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { ContractServiceComponent } from '../services/contrato.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PagosServiceComponent } from '../services/pagos.service';
import { CuponesServiceComponent } from '../services/cupones.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css'
})
export class PagosComponent implements OnInit {

  form: any;
  contratos: any;
  showData: boolean = false;
  private modalService = inject(NgbModal);
  closeResult = '';
  pagos: any;
  cuponesPendientes: any;
  cuponesFuturos: any;

  constructor(
    private contratoService: ContractServiceComponent,
    private paymentService: PagosServiceComponent,
    private cuponesService: CuponesServiceComponent,
    private fb: FormBuilder,
  ){

  }

  ngOnInit(): void {
    sessionStorage.setItem("breadcums", "Pagos");
    this.form = this.fb.group({
      rut: ['', [
        Validators.required, 
        Validators.pattern("^[0-9]*$"),
        Validators.maxLength(8)
      ]]
    });
  }

  buscarContratos(){
    //9404430
    let schema = sessionStorage.getItem("schema") || null;
    if(schema != null){
      this.contratoService.getContractsByRutForPay(this.form.value.rut, schema).subscribe((data) => {
        this.contratos = data;
        this.showData = true;
      })
    }else{
      this.contratoService.getContractsByRutForPay(this.form.value.rut, "").subscribe((data) => {
        this.contratos = data;
        this.showData = true;
      })
    }
  }

  showCupones(content: TemplateRef<any>, rut: any){
    console.log(rut);
    let schema = sessionStorage.getItem("schema") || null;
    if(schema != null){
      this.cuponesService.getCuponesPendientesByRutAndSchema(rut, 5, 2, schema).subscribe((data: any) => {
        this.cuponesPendientes = data;
      })
      this.cuponesService.getCuponesFuturosByRutAndSchema(rut, 5, 2, schema).subscribe((data: any) => {
        this.cuponesFuturos = data;
      })
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
    }else {
      this.cuponesService.getCuponesPendientesByRutAndSchema(rut, 2,5, "").subscribe((data: any) => {
        this.cuponesPendientes = data;
      })
      this.cuponesService.getCuponesFuturosByRutAndSchema(rut, 2,5, "").subscribe((data: any) => {
        this.cuponesFuturos = data;
      })
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title' }).result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
    }
  }

  showPayments(content: TemplateRef<any>, contrato: any){
    
    let schema = sessionStorage.getItem("schema") || null;
    /*console.log(contrato);
    console.log(contrato.numero);
    console.log(contrato.base);
    console.log(contrato.serie);
    console.log(schema);*/
    if(schema != null){
      this.paymentService.getPaymentByContract(contrato.numero, contrato.base, contrato.serie, schema).subscribe((data) => {
        this.pagos = data;
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          },
        );
      })
    }else {
      this.paymentService.getPaymentByContract(contrato.numero, contrato.base, contrato.serie, "").subscribe((data) => {
        this.pagos = data;
        this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title' }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          },
        );
      })
    }
  }
  
  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  get f(){
    return this.form.controls;
  }

  resetPage(){
    this.showData = false;
  }

  formatAmount(amount: number): string {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  formatAmountUF(amount: number): string {
    return amount.toLocaleString('de-DE', { minimumFractionDigits: 2 });
  }
}
