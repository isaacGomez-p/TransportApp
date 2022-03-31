import{ HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { IUsuario } from '../../../model/IUsuario';
import { environment } from '../../../environments/environment';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private urlService: string = environment.url

  //private urlService: string = "https://localhost:44341/api";
  
  constructor(private http: HttpClient, 
    public navCtrl: NavController,
    public geolocation: Geolocation) {
      this.getLatitud();
      this.getLongitud();
  }

  latitud: number = 0;
  longitud: number = 0;

  postUsuario(datos: IUsuario){
    return this.http.post(`${this.urlService}/TRS_`, datos);
  }

  login(usuario: string, clave: string): Observable<IUsuario>{
    return this.http.get<IUsuario>(`${this.urlService}/TRS_?usuario=`+usuario+`&constrasenia=`+clave);
  }

  /*putAgricultor(datos: Agricultor, id: number){
    return this.http.put(`${this.urlService}/AGD_Agricultor/`+id, datos);
  }

  
  */

  // Retorna todos los usuarios - Si envia 0 retorna todos los usuarios y si se envia el token lo busca
  getAllUser(token: string): Observable<IUsuario[]>{    
    return this.http.get<IUsuario[]>(`${this.urlService}/TRS_?token=`+token);
  }  

  getLatitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      //console.log('servicio ' + geoposition.coords.latitude);
      this.latitud = geoposition.coords.latitude;
    })    
  }

  getLongitud(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.longitud = geoposition.coords.longitude;
    });    
  }

}