import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setItems } from '../ingreso-egreso/estadistica/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
userSubs!:Subscription;
ingresosSubs!:Subscription;
  constructor(private store:Store<AppState>,
    private ingresoEgresoServices:IngresoEgresoService) { }
  ngOnInit(){
    this.userSubs=this.store.select('user')
    .pipe(
      filter(auth=>auth.user != null)
    )
    .subscribe(({user})=>{
      console.log(user);
      this.ingresosSubs=this.ingresoEgresoServices.initIngresosEgresosListener(user.uid)
      .subscribe(ingresoEgresoFB =>{
       this.store.dispatch(setItems({items:ingresoEgresoFB}))
      })
    })
  }
  ngOnDestroy(){
    this.ingresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
   }
}
