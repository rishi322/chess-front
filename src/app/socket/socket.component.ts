import { Component, OnInit } from '@angular/core';
import { MoveService } from '../service/move.service';

import { webSocket } from 'rxjs/webSocket'; 
@Component({
  selector: 'app-socket',
  template: `<h1>Real-time To-Do List</h1> 
  <ul> 
  <li *ngFor="let todo of todos">{{ todo }}</li> 
  </ul> 
  <input [(ngModel)]="newTodo" placeholder="Add a new todo"> 
  <button (click)="addTodo()">Add</button> 
  <button (click)="connectWebSocket()" [disabled]="isConnected">Connect</button> 
  <button (click)="disconnectWebSocket()" [disabled]="!isConnected">Disconnect</button> 
  <button (click)="resetList()">Reset</button>
`,
  styleUrls: ['./socket.component.css']
})
export class SocketComponent implements OnInit {
  todos: string[] = [];
  newTodo: string = '';
  isConnected: boolean = false;
  constructor(private webSocketService: MoveService) {
    this.todos = this.webSocketService.getTodoArr();
  }
  ngOnInit() {
    this.webSocketService.socket$ = webSocket('wss://chess-backend-1-gt42.onrender.com'); // Establish WebSocket connection 
    // Subscribe to the incoming messages from the WebSocket server 
    this.webSocketService.socket$.subscribe(
      (message) => {
        this.isConnected = true;
        var arrTodo: string[] = [];
        message.forEach((element: any) => {
          arrTodo.push(element.replace("\"", "").replace("\"", ""))
        });
        console.log(arrTodo);
        this.todos = arrTodo;
      },
      (error) => console.error('WebSocket error:', error),
      () => {
        this.isConnected = false;
        console.log('WebSocket connection closed');
      }
    );
  }
  addTodo() {
    if (this.newTodo.trim() !== '') {
      this.webSocketService.send(this.newTodo); // Send new to-do item to the server 
      this.newTodo = '';
    }
  }
  resetList() {
    this.webSocketService.send('reset!*(@h9890138ch1908'); // Send a special message to reset the to-do list 
  }
  connectWebSocket() {
    // Establish WebSocket connection 
    this.webSocketService.socket$ = webSocket('wss://chess-backend-1-gt42.onrender.com');
    this.webSocketService.socket$.subscribe(
      (message) => {
        this.isConnected = true;
        var arrTodo: string[] = [];
        message.forEach((element: any) => {
          arrTodo.push(element.replace("\"", "").replace("\"", ""))
        });
        console.log(arrTodo);
        this.todos = arrTodo;
      },
      (error) => console.error('WebSocket error:', error),
      () => {
        this.isConnected = false;
        console.log('WebSocket connection closed');
      }
    );
  }
  disconnectWebSocket() {
    this.webSocketService.disconnect(); // Close WebSocket connection 
  }
  isWebSocketConnected(): boolean {
    return this.webSocketService.isConnected(); // Check if WebSocket connection is established 
  }
  refresh() {
    this.todos = this.webSocketService.getTodoArr(); // Update the to-do list by retrieving it from the WebSocket service 
  }
}
