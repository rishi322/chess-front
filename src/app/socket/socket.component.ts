// import { Component, OnInit } from '@angular/core';
// import { MoveService } from '../service/move.service';

// import { webSocket } from 'rxjs/webSocket'; 
// @Component({
//   selector: 'app-socket',
//   template: `<h1>Real-time To-Do List</h1> 
//   <ul> 
//   <li *ngFor="let todo of todos">{{ todo }}</li> 
//   </ul> 
//   <input [(ngModel)]="newTodo" placeholder="Add a new todo"> 
//   <button (click)="addTodo()">Add</button> 
//   <button (click)="connectWebSocket()" [disabled]="isConnected">Connect</button> 
//   <button (click)="disconnectWebSocket()" [disabled]="!isConnected">Disconnect</button> 
//   <button (click)="resetList()">Reset</button>
// `,
//   styleUrls: ['./socket.component.css']
// })
// export class SocketComponent implements OnInit {
//   todos: string[] = [];
//   newTodo: string = '';
//   isConnected: boolean = false;
//   constructor(private webSocketService: MoveService) {
//     this.todos = this.webSocketService.getTodoArr();
//   }
//   ngOnInit() {
//     this.webSocketService.socket$ = webSocket('wss://chess-backend-1-gt42.onrender.com'); // Establish WebSocket connection 
//     // Subscribe to the incoming messages from the WebSocket server 
//     this.webSocketService.socket$.subscribe(
//       (message) => {
//         this.isConnected = true;
//         var arrTodo: string[] = [];
//         message.forEach((element: any) => {
//           arrTodo.push(element.replace("\"", "").replace("\"", ""))
//         });
//         console.log(arrTodo);
//         this.todos = arrTodo;
//       },
//       (error) => console.error('WebSocket error:', error),
//       () => {
//         this.isConnected = false;
//         console.log('WebSocket connection closed');
//       }
//     );
//   }
//   addTodo() {
//     if (this.newTodo.trim() !== '') {
//       this.webSocketService.send(this.newTodo); // Send new to-do item to the server 
//       this.newTodo = '';
//     }
//   }
//   resetList() {
//     this.webSocketService.send('reset!*(@h9890138ch1908'); // Send a special message to reset the to-do list 
//   }
//   connectWebSocket() {
//     // Establish WebSocket connection 
//     this.webSocketService.socket$ = webSocket('wss://chess-backend-1-gt42.onrender.com');
//     this.webSocketService.socket$.subscribe(
//       (message) => {
//         this.isConnected = true;
//         var arrTodo: string[] = [];
//         message.forEach((element: any) => {
//           arrTodo.push(element.replace("\"", "").replace("\"", ""))
//         });
//         console.log(arrTodo);
//         this.todos = arrTodo;
//       },
//       (error) => console.error('WebSocket error:', error),
//       () => {
//         this.isConnected = false;
//         console.log('WebSocket connection closed');
//       }
//     );
//   }
//   disconnectWebSocket() {
//     this.webSocketService.disconnect(); // Close WebSocket connection 
//   }
//   isWebSocketConnected(): boolean {
//     return this.webSocketService.isConnected(); // Check if WebSocket connection is established 
//   }
//   refresh() {
//     this.todos = this.webSocketService.getTodoArr(); // Update the to-do list by retrieving it from the WebSocket service 
//   }
// }




import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { MoveService } from '../service/move.service';

@Component({
  selector: 'app-socket',
  template: `
    <h1>Real-time To-Do List</h1>
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
export class SocketComponent implements OnInit, OnDestroy {
  todos: string[] = [];
  newTodo = '';
  isConnected = false;
  private sub?: Subscription;
  private localSocket?: WebSocketSubject<any>;

  // Use secure wss on production; ws for local dev
  private readonly WS_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'ws://localhost:7070'
    : 'wss://chess-backend-1-gt42.onrender.com';

  constructor(private webSocketService: MoveService) {
    // If your service exposes a snapshot array, load it
    try { this.todos = this.webSocketService.getTodoArr() || []; } catch { /* ignore */ }
  }

  ngOnInit(): void {
    // Optionally auto-connect on init:
    // this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    // if you created a local socket, close it
    if (this.localSocket) {
      this.localSocket.complete();
      this.localSocket = undefined;
    }
    // also call service disconnect if it exists
    try { this.webSocketService.disconnect(); } catch { /* ignore */ }
  }

  connectWebSocket(): void {
    // Avoid double connections
    if (this.isConnected) return;

    // create the socket and also make it available on the service (like your original code did)
    this.localSocket = webSocket(this.WS_URL);
    this.webSocketService.socket$ = this.localSocket;

    // subscribe and keep the subscription for cleanup
    this.sub = this.localSocket.subscribe({
      next: (message: any) => this.handleMessage(message),
      error: (err: any) => {
        console.error('WebSocket error:', err);
        this.isConnected = false;
      },
      complete: () => {
        console.log('WebSocket completed');
        this.isConnected = false;
      }
    });

    this.isConnected = true;
  }

  disconnectWebSocket(): void {
    this.sub?.unsubscribe();
    this.sub = undefined;
    if (this.localSocket) {
      this.localSocket.complete();
      this.localSocket = undefined;
    }
    // keep service in sync
    try { this.webSocketService.disconnect(); } catch { /* ignore */ }
    this.isConnected = false;
  }

  addTodo(): void {
    const text = this.newTodo.trim();
    if (!text) return;

    // prefer sending structured JSON if server expects it, otherwise send string
    try {
      // if service exposes sock$.next, send via service
      if ((this.webSocketService as any).sock$) {
        (this.webSocketService as any).sock$.next({ type: 'add', message: text });
      } else if (this.localSocket) {
        this.localSocket.next({ type: 'add', message: text });
      }
    } catch {
      // fallback to simple send via localSocket
      this.localSocket?.next(text);
    }

    this.newTodo = '';
  }

  resetList(): void {
    if (this.localSocket) this.localSocket.next({ type: 'reset' });
    else try { (this.webSocketService as any).sock$?.next({ type: 'reset' }) } catch {}
  }

  // Robust handler that supports several message formats coming from the server
  private handleMessage(message: any): void {
    // Defensive: ignore null/undefined
    if (message === null || message === undefined) return;

    let payload: any = message;

    // If server sent a JSON string, parse it
    if (typeof message === 'string') {
      try {
        payload = JSON.parse(message);
      } catch {
        // leave as raw string
        payload = message;
      }
    }

    // If the payload is an array of todos
    if (Array.isArray(payload)) {
      this.todos = payload.map(el => this.flattenToString(el));
      return;
    }

    // If payload is an object, check known types safely
    if (typeof payload === 'object' && payload !== null) {
      if (payload.type === 'todoList' && Array.isArray(payload.todos)) {
        this.todos = payload.todos.map((t: any) => this.flattenToString(t));
        return;
      }

      // move / start / message / playerJoined responses
      if (payload.type === 'move' || payload.type === 'start' || payload.type === 'message' || payload.type === 'playerJoined') {
        const text = payload.msg || payload.message || payload.info || JSON.stringify(payload);
        this.todos.push(this.flattenToString(text));
        return;
      }

      // userCount example
      if (payload.type === 'userCount' && (payload.count !== undefined)) {
        this.todos.push(`Users online: ${payload.count}`);
        return;
      }

      // Unknown object → push a readable JSON string (helps debugging)
      this.todos.push(JSON.stringify(payload));
      return;
    }

    // If it is a primitive (number/string/boolean) just push as string
    this.todos.push(String(payload));
  }

  // helper to convert objects or strings to readable string for UI
  private flattenToString(val: any): string {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val.replace(/"/g, '');
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    try {
      return typeof val === 'object' ? (val.msg || val.message || JSON.stringify(val)) : String(val);
    } catch {
      return String(val);
    }
  }
}
