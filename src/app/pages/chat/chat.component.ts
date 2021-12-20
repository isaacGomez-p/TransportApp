import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { Socket } from 'ngx-socket-io';
import { ToastController } from '@ionic/angular';
import { TalkService } from '../../services/talk/talk.service';
import Talk from 'talkjs';
import { IUsuario } from 'src/model/IUsuario';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  message = '';
  messages = [];
  currentUser = '';

  constructor(private socket: Socket, private toastCtrl: ToastController) {}

  ngOnInit() {

    this.socket.connect();
 
    let name = `user-${new Date().getTime()}`;
    this.currentUser = name;
    
    this.socket.emit('set-name', name);
 
    this.socket.fromEvent('users-changed').subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
 
    this.socket.fromEvent('message').subscribe(message => {
      this.messages.push(message);
    });
    
  }

  sendMessage() {
    this.socket.emit('send-message', { text: this.message });
    this.message = '';
  }
  ionViewWillLeave() {
    this.socket.disconnect();
  }
 
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
 

  /*private inbox: Talk.Inbox;
  private session: Talk.Session;
  private user: IUsuario;

  @ViewChild('talkjsContainer') talkjsContainer!: ElementRef;

  constructor(private talkService: TalkService) {}

  ngOnInit() {
    this.createInbox();
  }

  private async createInbox() {
    const otherApplicationUser = {
      cedula: 'form.value.cedula',
      confirContra: '',
      contrasenia: 'form.value.contrasenia',
      correo: 'form.value.correo.toUpperCase()',
      estado: 1,
      fechaNacimiento: new Date(),
      idUsuario: 2,
      nombre: 'm.value.nombre.toUpperCase()',      
      rol: 2,
      telefono: 'form.value.telefono',
      token:' dsadasdasd',
      usuario: 'usuario1'
  };
    this.user = JSON.parse(window.localStorage.getItem("user"));
    const session = await this.talkService.createCurrentSession(this.user);
    this.inbox = await this.talkService.createInbox(session, otherApplicationUser);
    this.inbox.mount(this.talkjsContainer.nativeElement);
  *(message = '';
  messages = [];
  currentUser = '';
 ))*/

}
