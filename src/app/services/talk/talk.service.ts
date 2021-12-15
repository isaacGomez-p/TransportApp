import { Injectable } from '@angular/core';
import { IUsuario } from 'src/model/IUsuario';
import Talk from 'talkjs';

@Injectable({
  providedIn: 'root'
})
export class TalkService {

  private currentUser: Talk.User;

  constructor() { }

  async createUser(usuario: IUsuario) {
    const role =  ""+usuario.rol;    
    await Talk.ready;
    return new Talk.User({
      id: usuario.idUsuario,
      name: usuario.nombre,
      photoUrl: 'https://e00-elmundo.uecdn.es/elmundo/2017/datos/sep/s4/salarios_comparador/img/user-nobody.jpg',
      role: role
    });
  }

  async createCurrentSession(usuario: IUsuario) {
    await Talk.ready;
    console.log("1"+JSON.stringify(usuario));
    this.currentUser = await this.createUser(usuario);
    const session = new Talk.Session({
         appId: 'twgaqpu1',
         me: this.currentUser
    });
    return session;
  } 

  private async getOrCreateConversation(session: Talk.Session, otherApplicationUser: any) {
    const otherUser = await this.createUser(otherApplicationUser);
    const conversation = session.getOrCreateConversation(Talk.oneOnOneId(this.currentUser, otherUser));
    conversation.setParticipant(this.currentUser);
    conversation.setParticipant(otherUser);
    return conversation;
  }

  async createInbox(session: Talk.Session, otherUser : IUsuario) {
    

    const conversation = await this.getOrCreateConversation(session, otherUser);
    return session.createInbox({selected: conversation});
 }

}
