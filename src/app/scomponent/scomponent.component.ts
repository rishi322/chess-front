 

import { Component, Renderer2, HostListener } from '@angular/core';
import {

  CdkDragDrop,

} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { webSocket } from 'rxjs/webSocket';
import { MoveService } from '../service/move.service';
import { Router } from '@angular/router';
import { UserServicesService } from '../userServices/user-services.service';

@Component({
  selector: 'app-scomponent',
  templateUrl: './scomponent.component.html',
  styleUrls: ['./scomponent.component.css']
})
export class ScomponentComponent {


  //click coordinates
  xclick: number = 0;
  yclick: number = 0

  constantMove: any[] = [];

  time: number;
  chessPieces: any[];
  curPiece: string;
  item: any[];
  msg: string;

  isDraggable = true;
  wMove = true;
  bMove = false;

  clickMove = false;
  gameId: string = ''
  initXclick: number = 0;
  initYclick: number = 0;
  ////constructor
  constructor(private service: UserServicesService, public renderer: Renderer2, private webSocketService: MoveService, private router: Router, private userServe: UserServicesService) {
    this.msg = 'msg'
    this.chessPieces = [];
    this.curPiece = ''
    this.item = [];
    this.data = [];
    this.time = 5

    const ur = this.router.url.split('/');

    this.gameId = ur[3];

  }
  ngAfterViewInit() {

    const intervalId = setInterval(() => {
      this.time = this.time - 1;
      if (this.time == 0) {
        if (this.wMove == false) {
          // alert('White wins')
        } else {

        }
        clearInterval(intervalId);
      }
    }, 1200)
    // It's safe to access ElementRef or ViewContainerRef here.
  }
  isConnected: boolean = false;
  todos: any[] = [];
  newTodo: string = ''
  mes: string = ''
  waiting: boolean = true;
  ar: any[] = []
  ngOnInit() {


    ////display pieces on start
this.movenumber = 0;


    this.defaultBoard();
    this.clearBoard();
    this.setBoard();
    
  }

  ShowBoard() {
    this.userServe.getBoard(this.gameId).subscribe((data) => {
      if (data) {
        //here is the problem

        this.chessPieces = data
        console.log(data)



        this.clearBoard();
        this.setBoard();
      }
    })
  }

  piecesToFen(pieces: any[]): string {
    const boardArray: string[][] = Array.from({ length: 8 }, () => Array(8).fill(' '));

    pieces.forEach(piecess => {
      const { col, row, piece } = piecess;
      boardArray[col - 1][row - 1] = piece;
    });

    return this.arrayToFen(boardArray);
  }
  clearBoard() {

    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        const element = document.getElementById(i + ',' + j);
        if (element) {

          element.style.background = ''
          element.innerHTML = ''
        }
      }
    }
  }
  fenConverter(fen1: string) {
    this.clearBoard();
    this.chessPieces = []
    const fen = fen1;
    var flag = 0
    const dividedfen = fen.split('/')
    const lastfn = dividedfen[dividedfen.length - 1]
    const dividedlastfen = lastfn.split(' ')
    var row = 0;
    var col = 0;

    var add = 0;
    dividedfen.forEach(fen => {
      add = 0;
      row++;

      for (let i = 1; i <= fen.length; i++) {
        if (add + i > 8) {
          break;
        }
        if (fen[i - 1] == ' ') {
          break;
        }
        if (fen[i - 1] === 'r' || fen[i - 1] === 'b' || fen[i - 1] === 'n' || fen[i - 1] === 'k' || fen[i - 1] === 'q' || fen[i - 1] === 'p') {
          this.chessPieces.push({ x: row, y: i + add, piece: 'B' + fen[i - 1].toUpperCase() })
        }
        if (fen[i - 1] === 'R' || fen[i - 1] === 'B' || fen[i - 1] === 'N' || fen[i - 1] === 'K' || fen[i - 1] === 'Q' || fen[i - 1] === 'P') {
          this.chessPieces.push({ x: row, y: i + add, piece: 'W' + fen[i - 1].toUpperCase() })
        }
        if (Number(fen[i - 1]) >= 2) {
          add += Number(fen[i - 1]) - 1;
        }

      }

    })

    dividedlastfen.forEach(item => {
      console.log(item)
    })
    console.log(this.chessPieces)
    this.setBoard();
  }
  arrayToFen(boardArray: string[][]): string {
    let fen = '';
    let emptySquareCount = 0;

    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const piece = boardArray[rank][file];

        if (piece === ' ') {
          emptySquareCount += 1;
        } else {
          if (emptySquareCount > 0) {
            fen += emptySquareCount.toString();
            emptySquareCount = 0;
          }
          if (piece[0] === 'W') {
            var p = piece[1].toLowerCase();
          } else {
            var p = piece[1].toUpperCase();
          }
          fen += p;
        }
      }

      if (emptySquareCount > 0) {
        fen += emptySquareCount.toString();
        emptySquareCount = 0;
      }

      if (rank > 0) {
        fen += '/';
      }
    }

    fen += ' w - - 0 1';

    return fen;
  }
  a: string = ''
  addTodo() {

    this.a = JSON.stringify(this.chessPieces)
    this.webSocketService.sendMessage(this.a, this.gameId);
    this.a = ''
  }
   swapCase(str: string): string {
    return str.split('').map(char => {
        if (char === char.toLowerCase()) {
            return char.toUpperCase();
        } else {
            return char.toLowerCase();
        }
    }).join('');
}
   convertToPiece(piece: string): string {
  switch (piece) {
    case 'BR': return 'r';
    case 'BP': return 'p';
    case 'BN': return 'n';
    case 'BB': return 'b';
    case 'BQ': return 'q';
    case 'BK': return 'k';
    case 'WR': return 'R';
    case 'WP': return 'P';
    case 'WN': return 'N';
    case 'WB': return 'B';
    case 'WQ': return 'Q';
    case 'WK': return 'K';
    default: return '';
  }
}

 convertToFEN(data: { row: number; col: number; piece: string }[]): string {
  let fen = '';
  let emptySquares = 0;

  // Convert piece placement
  for (let row = 1; row <=8; row++) {
    for (let col = 1; col <= 8; col++) {
      const square = this.chessPieces.find(square => square.row === col && square.col === row);
      
      if (square) {
        if(emptySquares > 1){
          fen = fen.slice(0,-1)
          fen += emptySquares
        }
        fen += this.convertToPiece(square.piece);
        
        emptySquares = 0;
      } else {
        emptySquares++;
        if(emptySquares > 1){
         
          fen = fen.slice(0,-1);
          fen += emptySquares;

        }
        if(emptySquares == 1){

          fen += emptySquares;
        }
      }

      if (col == 8 && emptySquares > 0) {
   
        emptySquares = 0;
      }
    }
    if (row <= 8) fen += '/';
    
  }

  console.log(fen)
  // Add active color, castling availability, en passant target, halfmove clock, fullmove number
  if(this.bMove == true){

    fen += ' b - - 0 ' + this.movenumber;
  }else{

    fen += ' w - - 0 ' + this.movenumber;
  }

  return fen;
}

movenumber:any;
async playcb(){

  while (this.movenumber < 100) {
    const fen = this.convertToFEN(this.chessPieces);
    const data = await this.getMovesFromServer(fen);
     this.ar= data.bestMove.split(`\\`)
    console.log(this.ar)
    let aar = [];
    aar = this.ar[0]
    const moveRegex = /bestmove\s+(\w+)/;
const match = aar.match(moveRegex)
  
    if(this.movenumber %2 == 0){
      this.bMove = true;
      this.wMove = false;
    }else{
      this.bMove = false;
      this.wMove = true;
    }
    console.log(data)
    if (match && match[1]) {
      const a = this.convertToCoordinates(match[1]);
      
      if (a) {
        const piece = this.getChessPiece(a.from[1],a.from[0]);
        console.log("this is a" + a )
      let svgHtml = 'PAWN'
      if (piece === 'BP') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png' height="50" width = "50">`;
      } else if (piece === 'BK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png' height="50" width = "50">`
      } else if (piece === 'BQ') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png' height="50" width = "50">`
      } else if (piece === 'BB') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png' height="50" width = "50">`
      } else if (piece === 'BN') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png' height="50" width = "50">`
      } else if (piece == 'BR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png' height="50" width = "50">>`
      }
      ///White piece
      if (piece === 'WP') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png' height="50" width = "50">`;
      } else if (piece === 'WK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png' height="50" width = "50">`
      } else if (piece === 'WQ') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png' height="50" width = "50">`
      } else if (piece === 'WB') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png' height="50" width = "50">`
      } else if (piece === 'WN') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png' height="50" width = "50">`
      } else if (piece == 'WR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png' height="50" width = "50">`
      }

      

      this.findandreplaceChessPieces(a.from[1],a.from[0],a.to[1],a.to[0])
      this.movenumber++;
      
      
      const element = document.getElementById( a.from[1] + ',' + a.from[0]);

      if(element){
        element.innerHTML = ''
      }

      const elementto = document.getElementById(a.to[1] + ","+ a.to[0]);

      if(elementto){
        if(elementto.innerHTML){
          
          elementto.innerHTML = svgHtml
          
        }
      }
      
     
      }
    }else{
      this.showAlert("no data","")
    }
  }
}
async playcw() {

  while (this.movenumber < 100) {
    const fen = this.convertToFEN(this.chessPieces);
    const data = await this.getMovesFromServer(fen);
    
    if (data && data.bestMove) {
      const a = this.convertToCoordinates(data.bestMove);
      
      if (a) {
        const piece = this.getChessPiece(a.from[1],a.from[0]);

      let svgHtml = 'PAWN'
      if (piece === 'BP') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png' height="50" width = "50">`;
      } else if (piece === 'BK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png' height="50" width = "50">`
      } else if (piece === 'BQ') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png' height="50" width = "50">`
      } else if (piece === 'BB') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png' height="50" width = "50">`
      } else if (piece === 'BN') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png' height="50" width = "50">`
      } else if (piece == 'BR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png' height="50" width = "50">>`
      }
      ///White piece
      if (piece === 'WP') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png' height="50" width = "50">`;
      } else if (piece === 'WK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png' height="50" width = "50">`
      } else if (piece === 'WQ') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png' height="50" width = "50">`
      } else if (piece === 'WB') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png' height="50" width = "50">`
      } else if (piece === 'WN') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png' height="50" width = "50">`
      } else if (piece == 'WR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png' height="50" width = "50">`
      }

      

      this.findandreplaceChessPieces(a.from[1],a.from[0],a.to[1],a.to[0])

this.bMove = true;
this.wMove = false;
      
      
      const element = document.getElementById( + a.from[1] + ',' + a.from[0]);

      if(element){
        element.innerHTML = ''
      }

      const elementto = document.getElementById(+ a.to[1] + ","+ a.to[0]);

      if(elementto){
        if(elementto.innerHTML){
          
          elementto.innerHTML = svgHtml
          
        }
      }
      
     
      }
    }
  }
}

getMovesFromServer(fen: string): Promise<any> {
  return this.service.getMoves(fen).toPromise();
}


showAlert(title: string, msg: string) {
  Swal.fire({
    title: title,
    text: msg,
    icon: 'warning',
  });
}

///setpiece
setPiece(r: number, c: number) {

  for (let i = 0; i < this.chessPieces.length; i++) {
    if (this.chessPieces[i].row == r && this.chessPieces[i].col == c) {
      return true
    }
  }


  return false;
}
findPiece(r: number, c: number) {


  for (let i = 0; i <= this.chessPieces.length; i++) {
    if (this.chessPieces[i].row == r && this.chessPieces[i].col == c) {
      return this.chessPieces[i].piece
    }
  }
  return 'nothing found'
}
setBoard() {

  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      if (this.setPiece(i, j) == true) {
        const a = this.convertToString(i, j)
        const element = document.getElementById(a);
        if (element) {

          var piece = this.findPiece(i, j)
          element.style.background = ''
          ///Black piece

          var svgHtml = ''
          if (piece === 'BP') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png' height="50" width = "50">`;
          } else if (piece === 'BK') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png' height="50" width = "50">`
          } else if (piece === 'BQ') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png' height="50" width = "50">`
          } else if (piece === 'BB') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png' height="50" width = "50">`
          } else if (piece === 'BN') {
            svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png' height="50" width = "50">`
          } else if (piece == 'BR') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png' height="50" width = "50">>`
          }
          ///White piece
          if (piece === 'WP') {
            svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png' height="50" width = "50">`;
          } else if (piece === 'WK') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png' height="50" width = "50">`
          } else if (piece === 'WQ') {
            svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png' height="50" width = "50">`
          } else if (piece === 'WB') {
            svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png' height="50" width = "50">`
          } else if (piece === 'WN') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png' height="50" width = "50">`
          } else if (piece == 'WR') {
            svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png' height="50" width = "50">`
          }

          element.innerHTML = svgHtml

        }
      }

    }
  }
}
///board pieces
defaultBoard() {
  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      if (j == 2)
        this.chessPieces.push({ row: i, col: j, piece: 'BP' })
      if (j == 7)
        this.chessPieces.push({ row: i, col: j, piece: 'WP' })

      if (i == 1 && j == 1 || i == 1 && j == 8 || i == 8 && j == 8 || i == 8 && j == 1) {
        if (i == 1 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: 'BR' })
        if (i == 1 && j == 8)
          this.chessPieces.push({ row: i, col: j, piece: 'WR' })
        if (i == 8 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: 'BR' })
        if (i == 8 && j == 8)
          this.chessPieces.push({ row: i, col: j, piece: "WR" })
      } else if (i == 2 && j == 1 || i == 2 && j == 8 || i == 7 && j == 8 || i == 7 && j == 1) {

        if (i == 2 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: 'BN' })
        if (i == 2 && j == 8)
          this.chessPieces.push({ row: i, col: j, piece: 'WN' })
        if (i == 7 && j == 8)
          this.chessPieces.push({ row: i, col: j, piece: 'WN' })
        if (i == 7 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: "BN" })
      } else if (i == 3 && j == 1 || i == 3 && j == 8 || i == 6 && j == 1 || i == 6 && j == 8) {
        if (i == 3 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: 'BB' })
        if (i == 3 && j == 8)
          this.chessPieces.push({ row: i, col: j, piece: 'WB' })
        if (i == 6 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: 'BB' })
        if (i == 6 && j == 8)
          this.chessPieces.push({ row: i, col: j, piece: "WB" })
      } else if (i == 4 && j == 1 || i == 4 && j == 8) {
        if (i == 4 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: 'BQ' })
        if (i == 4 && j == 8)
          this.chessPieces.push({ row: i, col: j, piece: 'WQ' })

      } else if (i == 5 && j == 1 || i == 5 && j == 8) {

        if (i == 5 && j == 8)

          this.chessPieces.push({ row: i, col: j, piece: 'WK' })
        if (i == 5 && j == 1)
          this.chessPieces.push({ row: i, col: j, piece: 'BK' })
      }



    }
  }
  console.log(this.chessPieces)
}
previousIndex: any[] = [];
legalIndexes: any[] = [];
///Legal Move Suggestion on click
showLegalMoves(r: number, c: number) {
  this.initXclick = r;
  this.initYclick = c;
  this.clickMove = true;
  this.clearHints();
  const piece = this.getChessPiece(r, c);
  console.log('calculating legal moves')
  const row = r;
  ///legal moves for bishops
  ////would have to write for each direction individually for bishops
  if (piece == 'WB' || piece == 'BB') {

    var legalCd = [];
    let flag = 0;
    let flag2 = 0;
    var flag4 = 0;
    var flag3 = 0
    console.log('this is bishop')
    for (let i = 1; i < 8; i++) {
      const fx = r + i
      const fy = c + i;
      const dx = r - i;
      const dy = c - i;

      const element = document.getElementById(fx + ',' + fy);
      if (element) {
        if (this.isChessPiece(fx, fy) == false && flag == 0) {
          legalCd.push({ x: fx, y: fy })
          element.style.backgroundColor = 'red'

        } else if (flag == 0) {
          if (this.detectEnemy(fx, fy, r, c) == true) {

            legalCd.push({ x: fx, y: fy })
            element.style.backgroundColor = 'red'


          }
          flag = 2;
        }

      }
      const element2 = document.getElementById(dx + ',' + dy);
      if (element2) {
        if (this.isChessPiece(dx, dy) == false && flag2 == 0) {
          legalCd.push({ x: dx, y: dy })
          element2.style.backgroundColor = 'red'
        } else if (flag2 == 0) {
          if (this.detectEnemy(dx, dy, r, c) == true) {

            legalCd.push({ x: dx, y: dy })
            element2.style.backgroundColor = 'red'


          }

          flag2 = 1;
        }
      }

      const element3 = document.getElementById(fx + ',' + dy)
      if (element3) {
        if (this.isChessPiece(fx, dy) == false && flag3 == 0) {
          legalCd.push({ x: fx, y: dy })
          element3.style.backgroundColor = 'red'
        } else if (flag3 == 0) {
          if (this.detectEnemy(fx, dy, r, c) == true) {

            legalCd.push({ x: fx, y: dy })
            element3.style.backgroundColor = 'red'


          }

          flag3 = 1;
        }
      }

      const element4 = document.getElementById(dx + ',' + fy)
      if (element4) {
        if (this.isChessPiece(dx, fy) == false && flag4 == 0) {
          legalCd.push({ x: dx, y: fy })
          element4.style.backgroundColor = 'red'
        } else if (flag4 == 0) {
          console.log(this.detectEnemy(dx, fy, r, c))
          console.log('detecting enemy')
          if (this.detectEnemy(dx, fy, r, c) == true) {

            legalCd.push({ x: dx, y: fy })
            element4.style.backgroundColor = 'red'


          }
          flag4 = 1;
        }
      }
    }

    this.previousIndex = legalCd
  }
  if (piece == 'WQ' || piece == 'BQ') {

    var legalCd = [];
    let flag = 0;
    let flag2 = 0;
    var flag4 = 0;
    var flag3 = 0
    console.log('this is bishop')
    for (let i = 1; i < 8; i++) {
      const fx = r + i
      const fy = c + i;
      const dx = r - i;
      const dy = c - i;

      const element = document.getElementById(fx + ',' + fy);
      if (element) {
        if (this.isChessPiece(fx, fy) == false && flag == 0) {
          legalCd.push({ x: fx, y: fy })
          element.innerHTML = `<div class="legal_move"  id='legal_` + fx + `,` + fy + `' style=" display:block;
            background-color:black;
            opacity:0.2;
            visibility:'hidden';
              margin-left:10px;
              margin-top:10px;
            border-radius:100px;
            width:20px;
            height:20px;
            "> <div>`

        } else if (flag == 0) {
          if (this.detectEnemy(fx, fy, r, c) == true) {
            legalCd.push({ x: fx, y: fy })
            element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

          }

          flag = 2;
        }

      }
      const element2 = document.getElementById(dx + ',' + dy);
      if (element2) {
        if (this.isChessPiece(dx, dy) == false && flag2 == 0) {
          legalCd.push({ x: dx, y: dy })
          element2.innerHTML = `<div class="legal_move"  id='legal_` + dx + `,` + dy + `' style=" display:block;
            background-color:black;
            opacity:0.2;
            visibility:'hidden';
              margin-left:10px;
              margin-top:10px;
            border-radius:100px;
            width:20px;
            height:20px;
            "> <div>`
        } else if (flag2 == 0) {
          if (this.detectEnemy(dx, dy, r, c) == true) {
            legalCd.push({ x: dx, y: dy })
            element2.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

          }
          flag2 = 1;
        }
      }

      const element3 = document.getElementById(fx + ',' + dy)
      if (element3) {
        if (this.isChessPiece(fx, dy) == false && flag3 == 0) {
          legalCd.push({ x: fx, y: dy })
          element3.innerHTML = `<div class="legal_move"  id='legal_` + fx + `,` + dy + `' style=" display:block;
            background-color:black;
            opacity:0.2;
            visibility:'hidden';
              margin-left:10px;
              margin-top:10px;
            border-radius:100px;
            width:20px;
            height:20px;
            "> <div>`
        } else if (flag3 == 0) {
          if (this.detectEnemy(fx, dy, r, c) == true) {
            legalCd.push({ x: fx, y: dy })
            element3.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

          }
          flag3 = 1;
        }
      }

      const element4 = document.getElementById(dx + ',' + fy)
      if (element4) {
        if (this.isChessPiece(dx, fy) == false && flag4 == 0) {
          legalCd.push({ x: dx, y: fy })
          element4.innerHTML = `<div class="legal_move"  id='legal_` + dx + `,` + fy + `' style=" display:block;
            background-color:black;
            opacity:0.2;
            visibility:'hidden';
              margin-left:10px;
              margin-top:10px;
            border-radius:100px;
            width:20px;
            height:20px;
            "> <div>`
        } else if (flag4 == 0) {
          if (this.detectEnemy(dx, fy, r, c) == true) {
            legalCd.push({ x: dx, y: fy })
            element4.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

          }
          flag4 = 1;
        }
      }
    }
    console.log(this.isChessPiece(1, 2))
    console.log(r, c)
    if (8 - c != 0 && 8 - c != 7) {
      console.log('yes');
      let dy = 8 - c;
      let a = 0;
      let b = 0;
      a = c
      for (let y = 1; y <= 8; y++) {
        let sum = c + y
        if (this.isChessPiece(r, sum) == true) {
          const element = document.getElementById(r + ',' + sum);
          if (element) {
            if (this.detectEnemy(r, sum, r, c) == true) {
              legalCd.push({ x: r, y: sum })
              element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

            }

          }
          break;
        } else {
          console.log("forward legal moves ")
          const element = document.getElementById(r + ',' + sum)

          if (element) {
            this.previousIndex.push({ x: r, y: sum })
            this.legalIndexes.push({ x: r, y: sum })
            element.innerHTML = `<div class="legal_move"  id='legal_` + r + `,` + sum + `' style=" display:block;
          background-color:black;
          opacity:0.2;
          visibility:'hidden';
            margin-left:10px;
            margin-top:10px;
          border-radius:100px;
          width:20px;
          height:20px;
          "> <div>`
          }
        }
      }
      for (let y = 1; y <= a; y++) {
        let diff = c - y
        console.log(c - y)
        if (this.isChessPiece(r, diff) == true) {
          const element = document.getElementById(r + ',' + diff);
          if (element) {
            if (this.detectEnemy(r, diff, r, c) == true) {
              legalCd.push({ x: r, y: diff })
              element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

            }
          }
          break;
        } else {

          console.log(r, diff, 'legal moves')

          const element = document.getElementById(r + ',' + diff)

          if (element) {

            this.previousIndex.push({ x: r, y: diff })
            this.legalIndexes.push({ x: r, y: diff })
            element.innerHTML = `<div class="legal_move"  id='legal_` + r + `,` + diff + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`

          }

        }
      }

    } else {
      for (let x = c + 1; x <= 8; x++) {

        console.log(this.isChessPiece(r, x))
        if (this.isChessPiece(r, x) == true) {
          console.log('else part')
          const element = document.getElementById(r + ',' + x);
          if (element) {
            if (this.detectEnemy(r, x, r, c) == true) {
              legalCd.push({ x: r, y: x })
              element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

            }
          }
          break;
        } else {
          const element = document.getElementById(r + ',' + x)
          if (element) {
            element.innerHTML = '<div>legal</div>'
          }

        }
      }
    }

    if (8 - r != 0 && 8 - r != 7) {
      console.log('horizontal')

      const dy = 8 - r;

      for (let y = 1; y <= 8; y++) {
        let sum = r - y
        if (this.isChessPiece(sum, c) == true) {
          const element = document.getElementById(sum + ',' + c);
          if (element) {
            if (this.detectEnemy(sum, c, r, c) == true) {
              legalCd.push({ x: sum, y: c })
              element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

            }
          }
          break;
        } else {
          console.log("forward legal moves ")
          const element = document.getElementById(sum + ',' + c)

          if (element) {
            this.previousIndex.push({ x: sum, y: c })
            this.legalIndexes.push({ x: sum, y: c })
            element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
          }
        }
      }
      for (let y = 1; y <= 8; y++) {
        let sum = r + y
        if (this.isChessPiece(sum, c) == true) {
          const element = document.getElementById(sum + ',' + c);
          if (element) {
            if (this.detectEnemy(sum, c, r, c) == true) {
              legalCd.push({ x: sum, y: c })
              element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

            }
          }
          break;
        } else {
          console.log("forward legal moves ")
          const element = document.getElementById(sum + ',' + c)

          if (element) {
            this.previousIndex.push({ x: sum, y: c })
            this.legalIndexes.push({ x: sum, y: c })
            element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
          }
        }
      }
    } else {
      if (r >= 8) {
        console.log('r >= 8')
        const dy = 8;
        for (let y = 1; y <= dy; y++) {
          let sum = r - y
          if (this.isChessPiece(sum, c) == true) {
            const element = document.getElementById(sum + ',' + c);
            if (element) {
              if (this.detectEnemy(sum, c, r, c) == true) {
                legalCd.push({ x: sum, y: c })
                element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

              }
            }
            break;
          } else {
            console.log("forward legal moves ")
            const element = document.getElementById(sum + ',' + c)

            if (element) {
              this.previousIndex.push({ x: sum, y: c })
              this.legalIndexes.push({ x: sum, y: c })
              element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
            }
          }
        }
      } else {
        console.log('r == 0')
        console.log('r >= 8')
        const dy = 8;
        for (let y = 1; y <= dy; y++) {
          let sum = r + y
          if (this.isChessPiece(sum, c) == true) {
            const element = document.getElementById(sum + ',' + c);
            if (element) {

              if (this.detectEnemy(sum, c, r, c) == true) {
                legalCd.push({ x: sum, y: c })
                element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

              }
            }
            break;
          } else {
            console.log("forward legal moves ")
            const element = document.getElementById(sum + ',' + c)

            if (element) {
              this.previousIndex.push({ x: sum, y: c })
              this.legalIndexes.push({ x: sum, y: c })
              element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
            }
          }
        }
      }
      console.log('h2')
    }
    this.previousIndex = legalCd
  }
  if (piece == 'WK') {
    console.log('this piece is king ')
  }
  //
  ///legal moves for Knights
  if (piece == 'WN' || piece == 'BN') {
    console.log('its a knight')


    this.previousIndex.forEach(square => {


      const element = document.getElementById(square.x + ',' + square.y)

      if (element) {

        console.log(element.children[0].tagName === 'svg' ? 'svg' + 1 : 0)
        if (element.children[0].tagName === 'svg') {

        } else {

          element.innerHTML = '<div></div>'
        }


      }


    });

    const legalCd = [{ x: r + 2, y: c + 1 }, { x: r + 2, y: c - 1 }, { x: r - 2, y: c + 1 }, { x: r - 2, y: c - 1 }, { x: r + 1, y: c - 2 }, { x: r - 1, y: c - 2 }, { x: r + 1, y: c + 2 }, { x: r - 1, y: c + 2 }]


    this.previousIndex = [];
    legalCd.forEach(lSqaure => {
      if (this.isChessPiece(lSqaure.x, lSqaure.y) == true) {

        const element = document.getElementById(lSqaure.x + ',' + lSqaure.y)
        if (element) {

          element.style.backgroundColor = 'rgba(242, 38, 19,0.7)'

        }
      } else {
        const element = document.getElementById(lSqaure.x + ',' + lSqaure.y)

        if (element) {
          console.log(element)
          element.innerHTML = `<div class="legal_move"  id='legal_` + lSqaure.x + `,` + lSqaure.y + `' style=" display:block;
            background-color:black;
            opacity:0.2;
            visibility:'hidden';
              margin-left:10px;
              margin-top:10px;
            border-radius:100px;
            width:20px;
            height:20px;
            "> <div>`
        }
      }

    });

    this.previousIndex = legalCd;
  }
  if (piece == 'BP') {
    if (c != 2) {
      for (let i = 0; i < this.previousIndex.length; i++) {
        console.log(this.previousIndex[i])
        console.log(this.previousIndex[i].x, this.previousIndex[i].y)
        const element = document.getElementById(this.previousIndex[i].x + ',' + this.previousIndex[i].y)

        if (element) {
          console.log(element.children[0].tagName === 'svg' ? 'svg' + 1 : 0)
          if (element.children[0].tagName === 'svg') {

          } else {

            element.innerHTML = '<div></div>'
          }


        }
      }

      for (let i = 1; i <= 1; i++) {

        const col = c + i;

        const element = document.getElementById(row + ',' + col)
        this.previousIndex.push({ x: row, y: col })
        if (element) {
          element.innerHTML = `<div class="legal_move"  id='legal_` + row + `,` + col + `' style=" display:block;
          background-color:black;
          opacity:0.2;
          visibility:'hidden';
            margin-left:10px;
            margin-top:10px;
          border-radius:100px;
          width:20px;
          height:20px;
          "> <div>`
        }
      }
    } else {
      for (let i = 0; i < this.previousIndex.length; i++) {
        console.log(this.previousIndex[i])
        console.log(this.previousIndex[i].x, this.previousIndex[i].y)
        const element = document.getElementById(this.previousIndex[i].x + ',' + this.previousIndex[i].y)

        if (element) {
          console.log(element.children[0].tagName === 'svg' ? 'svg' + 1 : 0)
          if (element.children[0].tagName === 'svg') {

          } else {

            element.innerHTML = '<div></div>'
          }


        }
      }

      for (let i = 1; i <= 2; i++) {
        const col = c + i;
        const element = document.getElementById(row + ',' + col)
        this.previousIndex.push({ x: row, y: col })
        if (element) {

          element.innerHTML = `<div class="legal_move"  id='legal_` + row + `,` + col + `' style=" display:block;
          background-color:black;
          opacity:0.2;
          visibility:'hidden';
            margin-left:10px;
            margin-top:10px;
          border-radius:100px;
          width:20px;
          height:20px;
          "> <div>`
        }
      }
    }

  }
  //legal moves for black pawn
  if (piece == 'WP') {
    if (c == 7) {

      if (this.isChessPiece(r - 1, c - 1) == true) {
        if (this.detectEnemy(r - 1, c - 1, r, c) == true) {
          const col = c - 1
          var ro = r - 1
          const element = document.getElementById(ro + ',' + col)
          this.previousIndex.push({ x: ro, y: col })
          if (element) {
            element.style.backgroundColor = 'red'
          }
        }
      }
      if (this.isChessPiece(r + 1, c - 1) == true) {
        if (this.detectEnemy(r + 1, c - 1, r, c) == true) {
          const col = c - 1
          var ro = r + 1
          const element = document.getElementById(ro + ',' + col)
          this.previousIndex.push({ x: ro, y: col })
          if (element) {
            element.style.backgroundColor = 'red'
          }
        }
      }


      for (let i = 1; i <= 2; i++) {
        const col = c - i;
        if (this.isChessPiece(r, col) == false) {
          const element = document.getElementById(row + ',' + col)
          this.previousIndex.push({ x: row, y: col })
          if (element) {
            element.innerHTML = `<div class="legal_move"  id='legal_` + row + `,` + col + `' style=" display:block;
          background-color:black;
          opacity:0.2;
          visibility:'hidden';
            margin-left:10px;
            margin-top:10px;
          border-radius:100px;
          width:20px;
          height:20px;
          "> <div>`
          }
        }
      }
    } else {
      if (this.isChessPiece(r - 1, c - 1) == true) {


        if (this.detectEnemy(r - 1, c - 1, r, c) == true) {
          const col = c - 1
          var ro = r - 1
          const element = document.getElementById(ro + ',' + col)
          this.previousIndex.push({ x: ro, y: col })
          if (element) {
            element.style.backgroundColor = 'red'
          }
        }
      }
      if (this.isChessPiece(r + 1, c - 1) == true) {
        if (this.detectEnemy(r + 1, c - 1, r, c) == true) {
          const col = c - 1
          var ro = r + 1
          const element = document.getElementById(ro + ',' + col)
          this.previousIndex.push({ x: ro, y: col })
          if (element) {
            element.style.backgroundColor = 'red'
          }
        }
      }


      for (let i = 1; i <= 1; i++) {
        const col = c - i;
        if (this.isChessPiece(r, col) == false) {


          const element = document.getElementById(row + ',' + col)
          this.previousIndex.push({ x: row, y: col })
          if (element) {
            element.innerHTML = `<div class="legal_move"  id='legal_` + row + `,` + col + `' style=" display:block;
          background-color:black;
          opacity:0.2;
          visibility:'hidden';
            margin-left:10px;
            margin-top:10px;
          border-radius:100px;
          width:20px;
          height:20px;
          "> <div>`
          }

        }
      }
    }

  }

  //legal moves for any rook
  if (piece == 'BR' || piece == 'WR') {
    console.log(this.isChessPiece(1, 2))
    console.log(r, c)
    if (8 - c != 0 && 8 - c != 7) {
      console.log('yes');
      let dy = 8 - c;
      let a = 0;
      let b = 0;
      a = c
      for (let y = 1; y <= 8; y++) {
        let sum = c + y
        if (this.isChessPiece(r, sum) == true) {
          break;
        } else {
          console.log("forward legal moves ")
          const element = document.getElementById(r + ',' + sum)

          if (element) {
            this.previousIndex.push({ x: r, y: sum })
            this.legalIndexes.push({ x: r, y: sum })
            element.innerHTML = `<div class="legal_move"  id='legal_` + r + `,` + sum + `' style=" display:block;
          background-color:black;
          opacity:0.2;
          visibility:'hidden';
            margin-left:10px;
            margin-top:10px;
          border-radius:100px;
          width:20px;
          height:20px;
          "> <div>`
          }
        }
      }
      for (let y = 1; y <= a; y++) {
        let diff = c - y
        console.log(c - y)
        if (this.isChessPiece(r, diff) == true) {
          break;
        } else {

          console.log(r, diff, 'legal moves')

          const element = document.getElementById(r + ',' + diff)

          if (element) {

            this.previousIndex.push({ x: r, y: diff })
            this.legalIndexes.push({ x: r, y: diff })
            element.innerHTML = `<div class="legal_move"  id='legal_` + r + `,` + diff + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`

          }

        }
      }

    } else {
      for (let x = c + 1; x <= 8; x++) {

        console.log(this.isChessPiece(r, x))
        if (this.isChessPiece(r, x) == true) {
          console.log('else part')
          break;
        } else {
          const element = document.getElementById(r + ',' + x)
          if (element) {
            element.innerHTML = '<div>legal</div>'
          }

        }
      }
    }

    if (8 - r != 0 && 8 - r != 7) {
      console.log('horizontal')

      const dy = 8 - r;

      for (let y = 1; y <= 8; y++) {
        let sum = r - y
        if (this.isChessPiece(sum, c) == true) {
          break;
        } else {
          console.log("forward legal moves ")
          const element = document.getElementById(sum + ',' + c)

          if (element) {
            this.previousIndex.push({ x: sum, y: c })
            this.legalIndexes.push({ x: sum, y: c })
            element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
          }
        }
      }
      for (let y = 1; y <= 8; y++) {
        let sum = r + y
        if (this.isChessPiece(sum, c) == true) {
          break;
        } else {
          console.log("forward legal moves ")
          const element = document.getElementById(sum + ',' + c)

          if (element) {
            this.previousIndex.push({ x: sum, y: c })
            this.legalIndexes.push({ x: sum, y: c })
            element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
          }
        }
      }
    } else {
      if (r >= 8) {
        console.log('r >= 8')
        const dy = 8;
        for (let y = 1; y <= dy; y++) {
          let sum = r - y
          if (this.isChessPiece(sum, c) == true) {
            break;
          } else {
            console.log("forward legal moves ")
            const element = document.getElementById(sum + ',' + c)

            if (element) {
              this.previousIndex.push({ x: sum, y: c })
              this.legalIndexes.push({ x: sum, y: c })
              element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
            }
          }
        }
      } else {
        console.log('r == 0')
        console.log('r >= 8')
        const dy = 8;
        for (let y = 1; y <= dy; y++) {
          let sum = r + y
          if (this.isChessPiece(sum, c) == true) {
            break;
          } else {
            console.log("forward legal moves ")
            const element = document.getElementById(sum + ',' + c)

            if (element) {
              this.previousIndex.push({ x: sum, y: c })
              this.legalIndexes.push({ x: sum, y: c })
              element.innerHTML = `<div class="legal_move"  id='legal_` + sum + `,` + c + `' style=" display:block;
              background-color:black;
              opacity:0.2;
              visibility:'hidden';
                margin-left:10px;
                margin-top:10px;
              border-radius:100px;
              width:20px;
              height:20px;
              "> <div>`
            }
          }
        }
      }
      console.log('h2')
    }

  }
  if (piece == 'BK' || piece == 'WK') {
    console.log('this is king ');

    let legalMoves = [];

    legalMoves.push({ x: r + 1, y: c + 1 }, { x: r - 1, y: c - 1 }, { x: r + 1, y: c - 1 }, { x: r - 1, y: c + 1 }, { x: r + 1, y: c }, { x: r - 1, y: c }, { x: r, y: c + 1 }, { x: r, y: c - 1 });
    legalMoves.forEach((item) => {
      if (item.x > 8 || item.y > 8 || item.x < 1 || item.y < 1) {
        item.x = 0
        item.y = 0
      }
    })
    console.log(legalMoves)

  }
  if (piece == '') {
    this.clickMove = false;
  }
}
// handleClick(event: MouseEvent): void {
//   this.xclick = event.clientX;
//   this.yclick = event.clientY;

// }

// Optional: Add a random click event
@HostListener('document:click', ['$event'])
handleRandomClick(event: MouseEvent): void {
  const randomX = Math.random() * window.innerWidth;
  const randomY = Math.random() * window.innerHeight;
  this.xclick = event.clientX;
  this.yclick = event.clientY;

  // const elee  = document.getElementById('hianimate-1-7')

  // if(elee){
  //   console.log(elee)

  //   console.log(elee)
  //   elee.style.transform = `translate(`+this.xclick+`px,`+this.yclick+`px)`
  // }else{
  //   console.log('no element found')
  // }


  console.log(`Random click at coordinates: X=${randomX}, Y=${randomY}`);
}
animateXY() {

  console.log("this. is element animatexy running ")
  const ele = document.getElementById('hianimate')
  if (ele) {
    ele.style.transform = `translate(` + this.xclick + `px, ` + this.yclick + `px)`
  } else {
    console.log('no element found')
  }
  console.log('this is running')
  console.log('')

}
wpLegal(r: number, c: number) {
  console.log('calculating legal moves')
  const row = r;

  for (let i = 0; i < this.previousIndex.length; i++) {
    console.log(this.previousIndex[i])
    console.log(this.previousIndex[i].x, this.previousIndex[i].y)
    const element = document.getElementById(this.previousIndex[i].x + ',' + this.previousIndex[i].y)

    if (element) {
      console.log(element.children[0].tagName === 'svg' ? 'svg' + 1 : 0)
      if (element.children[0].tagName === 'svg') {

      } else {

        element.innerHTML = '<div></div>'
      }


    }
  }

  for (let i = 1; i <= 2; i++) {
    const col = c - i;
    const element = document.getElementById(row + ',' + col)
    this.previousIndex.push({ x: row, y: col })
    if (element) {
      element.innerHTML = `<div class="legal_move"  id='legal_` + row + `,` + col + `' style=" display:block;
      background-color:black;
      opacity:0.2;
      visibility:'hidden';
        margin-left:10px;
        margin-top:10px;
      border-radius:100px;
      width:20px;
      height:20px;
      "> <div>`
    }
  }

}
clearHints() {

  for (let i = 1; i <= 8; i++) {
    for (let j = 1; j <= 8; j++) {
      const element = document.getElementById(i + ',' + j);
      if (element) {
        if (this.isChessPiece(i, j) == true) {
          element.style.backgroundColor = ''
        } else {
          element.style.background = ''
          element.innerHTML = '<div></div>'
        }
      }
    }
  }
  // for (let i = 0; i < this.previousIndex.length; i++) {
  //   const element = document.getElementById(this.previousIndex[i].x + ',' + this.previousIndex[i].y)

  //   if (element) {

  //     if (element.children[0].tagName === 'svg') {
  //       if(this.isChessPiece(this.previousIndex[i].x,this.previousIndex[i].y) == true){
  //         element.style.backgroundColor = ''
  //       }else{


  //         element.innerHTML = '<div></div>'
  //       }

  //     }
  //   }
  // }
  console.log(this.previousIndex)
  this.constantMove = [];
  this.constantMove = this.previousIndex
  console.log(this.constantMove)
  this.previousIndex = [];
}
convertToString(x: number, y: number): string {

  if (x < 1 || x == 0) {
    x = 1;
  }
  if (y < 1 || y == 0) {
    y = 1;
  }
  if (x > 8) {

    x = 8
  }
  if (y > 8) {
    y = 8
  }
  return x + ',' + y;
}
///Making Changes in the chessPieces Array for maintaining game records
findandreplaceChessPieces(r: number, c: number, dr: number, dc: number) {
  let count = 0
  if (dr <= 0) {
    dr = 1;
  }
  if (dc <= 0) {
    dc = 1;
  }
  if (dr >= 8) {
    dr = 8
  }
  if (dc >= 8) {
    dc = 8
  }
  for (let i = 0; i < 32; i++) {
    if (this.chessPieces[i].row == dr && this.chessPieces[i].col == dc) {
      count = count + 1

    }
    console.log(count, 'matches')
  }
  if (count == 1) {
    console.log(this.wMove)
    if (this.wMove == false) {

      for (let i = 0; i < 32; i++) {
        if (this.chessPieces[i].row == dr && this.chessPieces[i].col == dc) {
          if (this.chessPieces[i].piece === 'BK' || this.chessPieces[i].piece === 'BQ' || this.chessPieces[i].piece === 'BN' || this.chessPieces[i].piece === 'BB' || this.chessPieces[i].piece === 'BR' || this.chessPieces[i].piece === 'BP') {
            this.chessPieces[i].row = 0;
            this.chessPieces[i].col = 0
            console.log("black" + this.chessPieces[i].piece + " eliminated")
            this.showAlert("Capture","Black piece captured")
          }


        }
      }
    }
    if (this.bMove == false) {

      for (let i = 0; i < 32; i++) {
        if (this.chessPieces[i].row == dr && this.chessPieces[i].col == dc) {
          if (this.chessPieces[i].piece === 'WK' || this.chessPieces[i].piece === 'WQ' || this.chessPieces[i].piece === 'WN' || this.chessPieces[i].piece === 'WB' || this.chessPieces[i].piece === 'WR' || this.chessPieces[i].piece === 'WP') {
            this.chessPieces[i].row = 0;
            this.chessPieces[i].col = 0
            console.log("white" + this.chessPieces[i].piece + " eliminated")
            this.showAlert("Capture","White piece captured  ")
          }

        }
      }
    }
  }
  for (let i = 0; i < 32; i++) {
    if (this.chessPieces[i].row == r && this.chessPieces[i].col == c) {

      this.chessPieces[i].row = dr;
      this.chessPieces[i].col = dc

      return this.chessPieces[i]

    }
  }
}
getPieceColor(row: number, col: number) {
  for (let i = 0; i <= 31; i++) {
    if (this.chessPieces[i].row == row && this.chessPieces[i].col == col) {
      console.log('this is color')
      console.log(this.chessPieces[i].piece[0])
      if (this.chessPieces[i].piece[0] == 'B') {
        return 'black'
      }
      if (this.chessPieces[i].piece[0] == 'W') {
        return 'white'
      }


    }
  }
  return 'no piece'
}
pawnCheck(row: number, col: number, irow: number, icol: number) {
  ///writing some code to find legal set of moves for pawn
  ///check whether the pawns are to be moved for the first time
  ///checking the positions of the pawns, i.e. if the pawn is black and is in the 2 col then it is not yet moved



  const isPiece = this.getChessPiece(row, col);
  if (isPiece != null && row >= 1 && col <= 8) {
    if (row == irow + 1 || row == irow - 1) {
      if (col == icol + 1) {
        return true
      }
      return false
    }
    return false
  }





  return true;
}
///Handling Pieces after dropped onto a particular sqaure
//   legalmove = false;
//   checkMove(row: number, col: number, irow: number, icol: number) {
//     const icolor = this.getPieceColor(irow, icol)
//     const mcolor = this.getPieceColor(row, col)

//     var piece = this.getChessPiece(irow, icol)
//     console.log("checking move")

//     console.log(piece)



//     if (mcolor != null) {
//       if (icolor == mcolor) {

//         return false
//       }
//       console.log('hiiiiiiiiiiiiiiiiiii')
//       if (icolor != mcolor) {
//         console.log('hiiiiiiiiiiiiiiiiiii')
//         for (let i = 1; i < this.constantMove.length; i++) {

//           if (row == this.constantMove[i].x && col == this.constantMove[i].y) {
//             console.log('it is true')
//             console.log('hiiiiiiiiiiiiiiiiiii')
//             return true;

//           } else {
//             console.log(this.constantMove[i], row, col)
//             console.log('this is false but the colors are different ')

//           }
//         }


//         // if(piece === 'BP'){

//         //     if(row == irow){
//         //       if(col == icol + 1 || col == icol || col == icol + 2){
//         //         return true
//         //       }
//         //       return false
//         //     }
//         //     return false

//         // }else if(piece === 'WP'){
//         //   if(row == irow){
//         //     if(col == icol - 1 || col == icol || icol - 2){
//         //       console.log("white pawn legal")
//         //       return true
//         //     }
//         //     return false
//         //   }
//         //   return false
//         // }
//       }
//       return false;

//     } else {

//       for (let i = 1; i < this.constantMove.length; i++) {

//         if (row == this.constantMove[i].x && col == this.constantMove[i].y) {
//           console.log('it is true')
//           console.log('No piece situation')
//           return true;

//         } else {
//           console.log(this.constantMove[i], row, col)
//           console.log('this is false but the colors are different ')

//         }
//       }
//       return false;
//   }



//   // if(this.isChessPiece(row,col) == false ){
//   //   if(row <=8  && col <=8 && row > 0 && col > 0 ){
//   //     console.log('is a legal move')
//   //     return true;
//   //   }else{
//   //     return false
//   //   }
//   // }else {

//   //   console.log("illegal")
//   //   return false
//   // }

// }
LegalMoves(r: number, c: number) {
  this.showLegalMoves(r, c)
  console.log(this.legalIndexes)
}
checkingMove(r: number, c: number) {

  for (let i = 0; i < this.legalIndexes.length; i++) {
    if (this.legalIndexes[i].x == r && this.legalIndexes[i].y == c) {

      console.log('legal match')

      this.legalIndexes = []
      console.log(this.legalIndexes)

      return 'legal'

    }
  }

  console.log(this.legalIndexes)
  this.legalIndexes = []
  return 'illegal'

}
handlePieceMovement(event: CdkDragDrop<any[]>, r: number, c: number) {
  this.clearHints();

  this.clickMove = false;
  // console.log(event.container.data)
  // console.log(event.distance)
  let dx = event.distance.x;
  let dy = event.distance.y

  let x, y = 0;
  let fx = 0;
  let fy = 0;
  console.log(dx, dy)

  if (event.distance.x <= 0) {
    if (event.distance.x == 0) {
      dx = 0
      fy = 0
      x = event.container.data[0]
    } else {
      dx *= -1;
      fx = 1;
      console.log(event.container.data[0])
      x = event.container.data[0] - Math.floor(dx / 50);
    }
  } else {
    x = event.container.data[0] + Math.floor(dx / 50);
  }
  if (event.distance.y <= 0) {

    if (event.distance.y == 0) {
      dy = 0
      fy = 0
      y = event.container.data[1]
    } else {
      dy *= -1;
      fy = 1;
      console.log('yes', event.container.data, dy)
      y = event.container.data[1] - Math.floor(dy / 50)
    }

  } else {

    y = event.container.data[1] + Math.floor(dy / 50)
  }
  console.log(x, y)
  const initPcolor = this.getPieceColor(event.container.data[0], event.container.data[1])
  const movePcolor = this.getPieceColor(x, y);

  if (event.container.data[0] == x && event.container.data[1] == y) {

  } else {

    this.bMove = true;
    this.wMove = false;

    // console.log(this.checkingMove(x, y))

    if (this.checkMove(event.container.data[0], event.container.data[1], x, y) == true) {


      this.findandreplaceChessPieces(event.container.data[0], event.container.data[1], x, y)
      // this.addTodo()
      this.movenumber++;
      
     
      this.onclick(this.convertToFEN(this.chessPieces));
      // Swal.fire("hi",this.arrayToFen(this.chessPieces));


      console.log(this.chessPieces)
      console.log(x, y)
      localStorage.setItem('resumeGame', JSON.stringify(this.chessPieces))
      const a = this.convertToString(x, y)
      const b = this.convertToString(event.container.data[0], event.container.data[1])
      const hide = document.getElementById(b)
      if (hide) {

        hide.innerHTML = ``;
      } else {
        console.log('error')
      }
      console.log(this.getChessPiece(event.container.data[0], event.container.data[1]))
      let piece = this.getChessPiece(x, y);
      let svgHtml = 'pawn'
      ///Black piece
      if (piece === 'BP') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png' height="50" width = "50">`;
      } else if (piece === 'BK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png' height="50" width = "50">`
      } else if (piece === 'BQ') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png' height="50" width = "50">`
      } else if (piece === 'BB') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png' height="50" width = "50">`
      } else if (piece === 'BN') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png' height="50" width = "50">`
      } else if (piece == 'BR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png' height="50" width = "50">>`
      }
      ///White piece
      if (piece === 'WP') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png' height="50" width = "50">`;
      } else if (piece === 'WK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png' height="50" width = "50">`
      } else if (piece === 'WQ') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png' height="50" width = "50">`
      } else if (piece === 'WB') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png' height="50" width = "50">`
      } else if (piece === 'WN') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png' height="50" width = "50">`
      } else if (piece == 'WR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png' height="50" width = "50">`
      }


      const element = document.getElementById(a);

      if (element) {


        element.innerHTML = svgHtml



      } else {
        console.error(`Element with ID '${a}' not found.`);

      }
      this.isDraggable = true;
      const ele1 = document.getElementById('pawnnnx')
      if (ele1) {


      }
    }
  }

}
detectEnemy(x: number, y: number, myX: number, myY: number) {

  var diffColor = this.getPieceColor(x, y)
  var myColor = this.getPieceColor(myX, myY);
  console.log('detecting enemy works')
  if (diffColor == myColor) {
    console.log('its our piece')
    return false;
  } else {
    return true;
  }

}

checkMove(x: number, y: number, dx: number, dy: number) {
  const a = dx + x
  const b = dy + y
  console.log(a % 2, b % 2)



  if (dx == x && dy == y) {
    console.log('this is false')

    return false;
  } else {

    console.log('this is true')
    console.log(this.constantMove, dx, dy)
    for (let i = 0; i < this.constantMove.length; i++) {

      console.log(this.constantMove[i].x, this.constantMove[i].y)

      if (Number(this.constantMove[i].x) === dx && Number(this.constantMove[i].y) === dy) {
        return true;
      }

    }
    this.showAlert('Invalid Move', 'Choose a Valid Move'); ('invalid move')
    return false;


  }

}

data: number[]
chess = [1, 2, 3, 4, 5, 6, 7, 8]
todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];


movePiece(row: number, col: number) {
  this.clearHints();
  const x = row;
  const y = col;
  var flag = 0;

  console.log(this.checkMove(this.initXclick, this.initYclick, x, y))

  if (this.initXclick == row) {
    if (this.initYclick == col) {
      flag = 1;
    } else {
      flag = 0;
    }
  }


  if (this.checkMove(this.initXclick, this.initYclick, x, y) == true) {

    if (this.initXclick != 0 && this.initYclick != 0 && flag == 0) {
      console.log('initial position ' + this.initXclick + ',' + this.initYclick)
      console.log('movePiece' + row + ',' + col)
      this.clickMove = false;

      this.findandreplaceChessPieces(this.initXclick, this.initYclick, x, y)
      console.log(this.chessPieces)
      console.log(x, y)
      const a = this.convertToString(x, y)
      const b = this.convertToString(this.initXclick, this.initYclick)
      const hide = document.getElementById(b)
      // this.addTodo()
      this.onclick(this.convertToFEN(this.chessPieces))
      if (hide) {

        hide.innerHTML = ``;


      } else {
        console.log('error')
      }
      let piece = this.getChessPiece(x, y);
      console.log(piece)
      console.log('this is piece')
      let svgHtml = 'pawn'
      ///Black piece
      if (piece === 'BP') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png' height="50" width = "50">`;
      } else if (piece === 'BK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png' height="50" width = "50">`
      } else if (piece === 'BQ') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png' height="50" width = "50">`
      } else if (piece === 'BB') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png' height="50" width = "50">`
      } else if (piece === 'BN') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png' height="50" width = "50">`
      } else if (piece == 'BR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png' height="50" width = "50">>`
      }
      ///White piece
      if (piece === 'WP') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png' height="50" width = "50">`;
      } else if (piece === 'WK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png' height="50" width = "50">`
      } else if (piece === 'WQ') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png' height="50" width = "50">`
      } else if (piece === 'WB') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png' height="50" width = "50">`
      } else if (piece === 'WN') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png' height="50" width = "50">`
      } else if (piece == 'WR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png' height="50" width = "50">`
      }

      const element = document.getElementById(a);

      if (element) {


        element.innerHTML = svgHtml


      } else {
        console.error(`Element with ID '${a}' not found.`);

      }
      this.isDraggable = true;
      const ele1 = document.getElementById('pawnnnx')
      if (ele1) {


      }


    } else {
      console.log('sorry there are some errors')

    }

  }
  this.clickMove = false;
  this.initXclick = 0;
  this.initYclick = 0;

}

///Dealing with negative coordinates of cursor (x,y) as well as the distance travelled from the initial piece
locateme(x: number, y: number, mx: number, my: number) {
  if (x < 0) {
    x *= -1
  }
  if (y < 0) {
    y *= -1
  }
  if (mx < 0) {
    mx *= -1
  }
  if (my < 0) {
    my *= -1
  }
  var dx = mx - x;
  var dy = my - y;
  if (dx < 0) {

    dx *= -1;
  }
  if (dy < 0) {
    dy *= -1;
  }
  console.log('lm' + dx, dy, x, y, mx, my)
  return [dx / 50, dy / 50];
}

///Will return a boolean value after searching the coordinates in the this.chessPieces matrix
isChessPiece(row: number, col: number): boolean {

  const piece = this.getChessPiece(1, 1);

  const a = row;
  const b = col;
  for (let i = 0; i < this.chessPieces.length; i++) {
    if (this.chessPieces[i] !== null) {
      const x = this.chessPieces[i].row;
      if (this.chessPieces[i].row == a && this.chessPieces[i].col == b) {
        if (this.chessPieces[i].piece !== null) {
          this.curPiece = this.chessPieces[i].piece;
          return true;
        }
      }
    }
  }
  this.curPiece = ''
  return false;
}
///Will return the exact details of the piece for particular coordinates
getChessPiece(row: number, col: number): string {



  const a = row;
  const b = col;
  for (let i = 0; i < this.chessPieces.length; i++) {
    if (this.chessPieces[i] !== null) {
      const x = this.chessPieces[i].row;
      if (this.chessPieces[i].row == a && this.chessPieces[i].col == b) {
        if (this.chessPieces[i].piece !== null) {

          this.curPiece = this.chessPieces[i].piece;
          return this.chessPieces[i].piece;
        } else {
          console.log('No')
        }
      }
    }
  }
  return ''
}
 convertToCoordinates(move: string): { from: [number, number], to: [number, number] } | null {
  const fileLetters = 'abcdefgh';
  const rankNumbers = '12345678';

  if (move.length !== 4) {
      console.error("Invalid move format");
      return null;
  }

  const [fromFile, fromRank, toFile, toRank] = move.split('');

  const fromCol = fileLetters.indexOf(fromFile);
  const fromRow = 8 - rankNumbers.indexOf(fromRank);

  const toCol = fileLetters.indexOf(toFile);
  const toRow = 8 - rankNumbers.indexOf(toRank);

  return {
      from: [fromRow, fromCol +1],
      to: [toRow, toCol +1]
  };
}


mbdata: any
onclick(fen:string){
  this.service.getMoves(fen).subscribe((data) => {
   
    console.log(this.mbdata)
    this.ar= data.bestMove.split(`\\`)
    console.log(this.ar)
    let aar = [];
    aar = this.ar[0]
    const moveRegex = /bestmove\s+(\w+)/;
const match = aar.match(moveRegex)
    if(match && match[1]){
      console.log(match[1])

     const a = this.convertToCoordinates(match[1]);
     console.log('this is a' + a )
     console.log(a)
     if(a){

      // this.showAlert("from",a?.from[0].toString() + "," + a?.from[1].toString() );
      
      // this.showAlert("to",a?.to[0].toString() + "," + a?.to[1].toString() );

      
      const piece = this.getChessPiece(a.from[1],a.from[0]);

      let svgHtml = 'PAWN'
      if (piece === 'BP') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png' height="50" width = "50">`;
      } else if (piece === 'BK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png' height="50" width = "50">`
      } else if (piece === 'BQ') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png' height="50" width = "50">`
      } else if (piece === 'BB') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png' height="50" width = "50">`
      } else if (piece === 'BN') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png' height="50" width = "50">`
      } else if (piece == 'BR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png' height="50" width = "50">>`
      }
      ///White piece
      if (piece === 'WP') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png' height="50" width = "50">`;
      } else if (piece === 'WK') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png' height="50" width = "50">`
      } else if (piece === 'WQ') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png' height="50" width = "50">`
      } else if (piece === 'WB') {
        svgHtml = ` <img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png' height="50" width = "50">`
      } else if (piece === 'WN') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png' height="50" width = "50">`
      } else if (piece == 'WR') {
        svgHtml = `<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png' height="50" width = "50">`
      }

      

      this.findandreplaceChessPieces(a.from[1],a.from[0],a.to[1],a.to[0])

this.bMove = false;
this.wMove = true;
      
      
      const element = document.getElementById( + a.from[1] + ',' + a.from[0]);

      if(element){
        element.innerHTML = ''
      }

      const elementto = document.getElementById(+ a.to[1] + ","+ a.to[0]);

      if(elementto){
        if(elementto.innerHTML){
          
          elementto.innerHTML = svgHtml
          
        }
      }
      
     }


    }
    
  // this.showAlert("predicted move",match[1])
    
    // console.log(this.mbdata)
    // this.mbdata = this.mbdata[19].split(`\\`)
    // this.mbdata = this.mbdata[0];
    // console.log(this.mbdata + ": mbdata")
    // for(let i = 0 ; i <= this.mbdata.length; i++){
    //   if(this.mbdata[i] !="null")
    //     {
          
    //   let a = this.mbdata[i].split('\\')

    //   for(let j = 0 ; j <= a.length; a++){
    //     if(a[j]==='bestMove'){
    //       this.mbdata = a[0];
    //       console.log("best move found")
    //     }else{
    //       console.log('not found best move')
    //     }
    //   }
    //     }

    // }
  })
}

}
