import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { NavbarComponent } from './navbar/navbar.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlaybtnComponent } from './playbtn/playbtn.component';
import { DragndropComponent } from './dragndrop/dragndrop.component';
import { PawnComponent } from './pawn/pawn.component';
import { FormsModule } from '@angular/forms';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: `https://chess-backend-b044.onrender.com`, // Use 'http' instead of 'ws' for Socket.IO
  options: {
    transports: ['websocket'], // Use only WebSocket transport
// Automatically connect on initialization
    // Additional options...
  },
};

import { FenconverterComponent } from './fenconverter/fenconverter.component';
import { SocketComponent } from './socket/socket.component';
import { NewBoardComponent } from './new-board/new-board.component';
import { PlayerTwoBoardComponent } from './player-two-board/player-two-board.component';
import { LoginComponent } from './login/login.component';
import { UserServicesService } from './userServices/user-services.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserHomeComponent } from './user-home/user-home.component';
import { SingleplayerComponent } from './singleplayer/singleplayer.component';
import { ScomponentComponent } from './scomponent/scomponent.component';
@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    NavbarComponent,
    PlaybtnComponent,
    DragndropComponent,
    PawnComponent,
    FenconverterComponent,
    SocketComponent,
    NewBoardComponent,
    PlayerTwoBoardComponent,
    LoginComponent,
    UserHomeComponent,
    SingleplayerComponent,
    ScomponentComponent
  ],
  
  imports: [FormsModule,
    BrowserModule,
    AppRoutingModule,DragDropModule,
    SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
