import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingre-egreso.models';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { isLoading, stopLoading } from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm!:FormGroup;
  tipo:string = 'ingreso';
  cargando:boolean=false;
  loadingSubs!:Subscription;
  constructor(private fb: FormBuilder,
    private ingresoEgresoServices:IngresoEgresoService,
    private store:Store<AppState>) { }
  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSubs=this.store.select('ui')
    .subscribe(({isLoading})=>this.cargando=isLoading)
    this.ingresoForm=this.fb.group({
      descripcion:['',Validators.required],
      monto:['',Validators.required],
    });
  }
guardar(){

  if(this.ingresoForm.invalid){return;}
  this.store.dispatch(isLoading())

  const {descripcion,monto}=this.ingresoForm.value;
  const ingresoEgreso=new IngresoEgreso(descripcion,monto,this.tipo);
  this.ingresoEgresoServices.crearIngresoEgreso(ingresoEgreso)
  .then(()=>{
    this.ingresoForm.reset();
    this.store.dispatch(stopLoading());
    Swal.fire('Registro creado', descripcion,'success');
  })
  .catch(err=>{
    this.store.dispatch(stopLoading());
    Swal.fire('Error',err.message,'error')
  })
}
}
