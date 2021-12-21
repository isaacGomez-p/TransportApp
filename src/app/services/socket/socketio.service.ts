import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket;
  constructor() {   }

  setupSocketConnection(token: string) {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      auth: {
        token
      }
    });
  }

  
  // Handle message receive event
  subscribeToMessages = (cb) => {
    console.log("--------- 1")
    if (!this.socket) 
      return(true);
      console.log("--------- 2")
    this.socket.on('message', msg => {
      console.log('Room event received!');
      return cb(null, msg);
    });
  }

  sendMessage = ({message, roomName}, cb) => {
    console.log("--------- 1 - 1")
    if (this.socket) {
      console.log("--------- 1 - 2")
      this.socket.emit('message', { message, roomName }, cb);
    }
    console.log("--------- 1 - 3")
  }

  joinRoom = (roomName) => {
    this.socket.emit('join', roomName);
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
