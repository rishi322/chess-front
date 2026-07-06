import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DragndropComponent } from './dragndrop/dragndrop.component';
import { FenconverterComponent } from './fenconverter/fenconverter.component';
import { SocketComponent } from './socket/socket.component';
import { NewBoardComponent } from './new-board/new-board.component';
import { PlayerTwoBoardComponent } from './player-two-board/player-two-board.component';
import { LoginComponent } from './login/login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { SingleplayerComponent } from './singleplayer/singleplayer.component';
import { ScomponentComponent } from './scomponent/scomponent.component';


const routes: Routes = [{
  path:"",
  
  children:[
  
    {path:'fen-convert',component:FenconverterComponent},
    {path:'socket-web',component:SocketComponent},
    // {path:"dragndrop",component:DragndropComponent},
    {path:'singleplayer',component:ScomponentComponent},
    {path:'',component:LoginComponent},

    
]
},{path:'home',component:UserHomeComponent},
{path:'user', children:[{
  path:':id',
children:[{path:"stockfishlevelxyz",component: SingleplayerComponent},{path:':id',component:PlayerTwoBoardComponent},{path:"",component:UserHomeComponent}]
}]},
{
  path:'fenc',
  component:NewBoardComponent
},{
  path:"player2",
  component:PlayerTwoBoardComponent
},{
  path:'login',
  component:LoginComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
