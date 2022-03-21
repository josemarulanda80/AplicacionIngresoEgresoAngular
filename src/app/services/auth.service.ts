import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.models';
import 'firebase/firestore'
import * as auth from '../auth/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ConditionalExpr } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../models/ingre-egreso.models';
import { unSetItems } from '../ingreso-egreso/estadistica/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
userSubpcription!:Subscription;
private _user!:Usuario|null;
get user(){
  return this._user;
}
  constructor(public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store:Store<AppState>) { }
  initAuthListener(){
    this.auth.authState.subscribe(fuser=>{
      if(fuser){
        this.userSubpcription=this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe((firestoreUser: any) => {
          console.log({firestoreUser})
          const user = Usuario.fromFirebase(firestoreUser)
          this._user=user;
          this.store.dispatch(auth.setUser({user:user}));
   
        })
      }else{
        this._user=null;
        this.userSubpcription.unsubscribe();
        this.store.dispatch(auth.unSetUser())
        this.store.dispatch(unSetItems())
      }
     
    })
  }
  
  crearUsuario(nombre:string,email:string,password:string){
    return this.auth.createUserWithEmailAndPassword(email,password)
    .then(({user})=>{
      const newUser = new Usuario(user!.uid,nombre,email);
      return this.firestore.doc(`${user!.uid}/usuario`)
      .set({...newUser})
    });
  }
  loginUsuario(email:string,password:string){
    return this.auth.signInWithEmailAndPassword(email,password);
  }
  logout(){
   return   this.auth.signOut()
  }          
  isAuth(){
    return this.auth.authState.pipe(
      map(fbUser=>fbUser != null)
      
    )
  }
}
