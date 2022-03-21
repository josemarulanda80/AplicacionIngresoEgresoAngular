import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingre-egreso.models';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy{
  ingresosEgresos:IngresoEgreso[]=[]
  ingresosSubs!:Subscription;
  constructor(private store:Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }
  ngOnDestroy() {
    this.ingresosSubs.unsubscribe();
  }

  ngOnInit() {
    this.ingresosSubs=this.store.select('ingresosEgresos')
    .subscribe(({items})=>this.ingresosEgresos=items)
  }
  borrar(uid:string){
   this.ingresoEgresoService.borrarIngresoEgreso(uid)
   .then(()=>Swal.fire('Borrado','Item borrado', 'success'))
   .catch(err=>Swal.fire('Error',err.message,'error'));
  }


}
