import{ HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { IUsuario } from '../../../model/IUsuario';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private urlService: string = environment.url

  //private urlService: string = "https://localhost:44341/api";
  
  constructor(private http: HttpClient, public navCtrl: NavController) {    
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

  // Retorna todos los usuarios
  getAllUser(): Observable<IUsuario[]>{       
    return this.http.get<IUsuario[]>(`${this.urlService}/TRS_?idUs=0`); //Se le retonar todos los datos
  }  

}