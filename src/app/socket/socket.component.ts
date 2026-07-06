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
//     this.webSocketService.socket$ = webSocket('ws://chess-backend-1-gt42.onrender.com'); // Establish WebSocket connection 
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
//     this.webSocketService.socket$ = webSocket('ws://localhost:8080');
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

  // Keep using the same service and property names as before
  constructor(private webSocketService: MoveService) {
    try {
      this.todos = this.webSocketService.getTodoArr() || [];
    } catch {
      this.todos = [];
    }
  }

  ngOnInit() {
    // Auto-connect on init (same url you had); we create socket and mark connected
    this.webSocketService.socket$ = webSocket('wss://chess-backend-1-gt42.onrender.com');
    // Mark connected as soon as socket object exists
    this.isConnected = true;

    // Subscribe with robust handler (DO NOT assume message is an array)
    this.webSocketService.socket$.subscribe(
      (message) => {
        // Safely handle different incoming shapes: array, object, number, string
        try {
          // If message is a string, try parse
          let payload: any = message;
          if (typeof message === 'string') {
            try { payload = JSON.parse(message); } catch { payload = message; }
          }

          // If payload is an array of items (old behavior), map to strings
          if (Array.isArray(payload)) {
            const arrTodo: string[] = payload.map((element: any) => {
              try { return String(element).replace(/"/g, ''); } catch { return String(element); }
            });
            console.log(arrTodo);
            this.todos = arrTodo;
            return;
          }

          // If payload is an object with known types
          if (payload && typeof payload === 'object') {
            // userCount object: { type: 'userCount', count: N }
            if (payload.type === 'userCount' && (payload.count !== undefined)) {
              // push a human readable count or handle separately
              this.todos.push(`Users online: ${payload.count}`);
              return;
            }

            // todoList object: { type: 'todoList', todos: [...] }
            if (payload.type === 'todoList' && Array.isArray(payload.todos)) {
              this.todos = payload.todos.map((t: any) => String(t).replace(/"/g, ''));
              return;
            }

            // move/start/message objects used by your backend
            if (payload.type === 'move' || payload.type === 'start' || payload.type === 'message' || payload.type === 'playerJoined') {
              // prefer msg, message, or fallback to JSON
              const text = payload.msg || payload.message || JSON.stringify(payload);
              this.todos.push(String(text));
              return;
            }

            // fallback: unknown object — push a readable JSON
            this.todos.push(JSON.stringify(payload));
            return;
          }

          // If it's a primitive like number (your original user count broadcast)
          if (typeof payload === 'number' || typeof payload === 'boolean') {
            this.todos.push(String(payload));
            return;
          }

          // fallback: treat as string
          this.todos.push(String(payload));
        } catch (err) {
          console.error('Error handling websocket message:', err, message);
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      },
      () => {
        this.isConnected = false;
        console.log('WebSocket connection closed');
      }
    );
  }

  addTodo() {
    if (this.newTodo.trim() !== '') {
      // keep calling your service's send as before
      this.webSocketService.send(this.newTodo);
      this.newTodo = '';
    }
  }
  resetList() {
    // keep same string as original, service should send it
    this.webSocketService.send('reset!*(@h9890138ch1908');
  }
  connectWebSocket() {
    // If already connected do nothing
    if (this.isConnected) return;

    // Establish WebSocket connection exactly as before
    this.webSocketService.socket$ = webSocket('wss://chess-backend-1-gt42.onrender.com');
    this.isConnected = true;

    // Re-subscribe using the same robust handler logic to avoid crashes
    this.webSocketService.socket$.subscribe(
      (message) => {
        try {
          let payload: any = message;
          if (typeof message === 'string') {
            try { payload = JSON.parse(message); } catch { payload = message; }
          }

          if (Array.isArray(payload)) {
            const arrTodo: string[] = payload.map((element: any) => {
              try { return String(element).replace(/"/g, ''); } catch { return String(element); }
            });
            console.log(arrTodo);
            this.todos = arrTodo;
            return;
          }

          if (payload && typeof payload === 'object') {
            if (payload.type === 'userCount' && (payload.count !== undefined)) {
              this.todos.push(`Users online: ${payload.count}`);
              return;
            }
            if (payload.type === 'todoList' && Array.isArray(payload.todos)) {
              this.todos = payload.todos.map((t: any) => String(t).replace(/"/g, ''));
              return;
            }
            if (payload.type === 'move' || payload.type === 'start' || payload.type === 'message' || payload.type === 'playerJoined') {
              const text = payload.msg || payload.message || JSON.stringify(payload);
              this.todos.push(String(text));
              return;
            }
            this.todos.push(JSON.stringify(payload));
            return;
          }

          if (typeof payload === 'number' || typeof payload === 'boolean') {
            this.todos.push(String(payload));
            return;
          }

          this.todos.push(String(payload));
        } catch (err) {
          console.error('Error handling websocket message:', err, message);
        }
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
    this.isConnected = false;
  }
  isWebSocketConnected(): boolean {
    return this.webSocketService.isConnected(); // Check if WebSocket connection is established 
  }
  refresh() {
    this.todos = this.webSocketService.getTodoArr(); // Update the to-do list by retrieving it from the WebSocket service 
  }
}
