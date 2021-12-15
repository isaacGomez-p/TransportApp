import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TalkService } from '../../services/talk/talk.service';
import Talk from 'talkjs';
import { IUsuario } from 'src/model/IUsuario';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  private inbox: Talk.Inbox;
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
  }

}
