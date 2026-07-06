import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';

import { map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MoveService {
    constructor(private socket: Socket,private http:HttpClient) { }
  public socket$!: WebSocketSubject<any>;
  private todoArr: string[] = [];
  public sock$!:WebSocketSubject<any>
  connect() {
    this.socket$ = webSocket('wss://chess-backend-1-gt42.onrender.com'); 
    this.sock$ = webSocket("wss://chess-backend-1-gt42.onrender.com")
    // Replace with your WebSocket server URL 
  }
  disconnect() {
    this.socket$.complete();
  }
  isConnected(): boolean {
    return (this.socket$ === null ? false : !this.socket$.closed);
  }
  
  onMessage(): Observable<any> {
    return this.socket$!.asObservable().pipe(
      map(message => message)
    );
  }
  // send(message: any) {

  //   this.socket$.next(message);
  // }

  send(message: any) {

    this.socket$.next(message);
  } 

  sendMessage(message:any,gameId:any){
    const result = [{type:"moves",message:message,gameId}]
    this.socket$.next(result)
  }
  
  createGame(message:any,creater:any){
    this.sock$.next({type:'create',message:message,creater:creater})
  }
  makeMove(){
    this.socket.on('makeMove', (data: { thismove: string }) => {
      console.log('Received data:', data);
      return data;
      // Handle the received data as needed
    });
  }
  joinGame(message:string,url:string){
     this.sock$.next({type:'join',message:url,gameId:message})
    
  }

  findAndJoinGame(url:string,joiny:any){
    return this.http.post<any>("https://chess-backend-b044.onrender.com/games/joinGame",{gameId:url,player2:joiny});
   }
  getTodoArr(): string[] {
    return this.todoArr;
  }

 
}
