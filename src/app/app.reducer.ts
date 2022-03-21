import { Auth } from '@angular/fire/auth';
import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducers';
import * as ingresoEgreso from './ingreso-egreso/estadistica/ingreso-egreso.reducer'


export interface AppState {
   ui: ui.State,
   user:auth.State,
   ingresosEgresos:ingresoEgreso.State
}



export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
   user: auth.authReducer,
   ingresosEgresos: ingresoEgreso.ingresoEgresoReducer
}