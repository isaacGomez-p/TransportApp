import{ HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { IVehiculo } from 'src/model/IVehiculo';

@Injectable({
  providedIn: 'root'
})

export class VehiculoService {

  private urlService: string = environment.url  
  
  constructor(private http: HttpClient, public navCtrl: NavController) {    
  }


  postVehiculo(datos: IVehiculo){
    return this.http.post(`${this.urlService}/TRS_?idVe=0`, datos);
  }  

  // Retorna los vehiculos
  getVehiculos(id: number): Observable<IVehiculo[]>{       
    return this.http.get<IVehiculo[]>(`${this.urlService}/TRS_?idVE=`+id);
  }  

}