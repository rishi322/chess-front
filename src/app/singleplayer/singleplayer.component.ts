import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Chess } from 'chess.js';
import { UserServicesService } from '../userServices/user-services.service';
import { MoveService } from '../service/move.service';
import { webSocket } from 'rxjs/webSocket';
import Swal from 'sweetalert2';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-singleplayer',
  templateUrl: './singleplayer.component.html',
  styleUrls: ['./singleplayer.component.css']
})
export class SingleplayerComponent implements OnInit {


mbdata:any;
 constructor(private service: UserServicesService){

 }
 ngOnInit(): void {
   
 }


  onclick(){
     const fen = "2bqkbnr/8/8/8/4P3/8/8/2BQKB1R b KQkq - 1 2"
    this.service.getMoves(fen).subscribe((data)=>{
      this.mbdata = data

      console.log(this.mbdata)
      this.mbdata = data.bestMove.split(`\\`)
      this.mbdata = this.mbdata[0].split(' ')
      console.log(this.mbdata)
      this.mbdata = this.mbdata[19].split(`\\`)
      this.mbdata = this.mbdata[0];
    })
  }




}
