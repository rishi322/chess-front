
import { Component, Renderer2, HostListener } from '@angular/core';
import {

  CdkDragDrop,

} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';

import { MoveService } from '../service/move.service';

@Component({
  selector: 'app-fenconverter',
  templateUrl: './fenconverter.component.html',
  styleUrls: ['./fenconverter.component.css']
})
export class FenconverterComponent {



  fenStr: string = ''
  fen:string = ''
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

  initXclick: number = 0;
  initYclick: number = 0;




  ////constructor
  constructor(public renderer: Renderer2) {
  
    this.msg = 'msg'
    this.chessPieces = [];
    this.curPiece = ''
    this.item = [];
    this.data = [];
    this.time = 5
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

  ngOnInit() {


    ////display pieces on start
    const newGame = true;
   
    this.defaultBoard()

    console.log(this.chessPieces)

  }
  chessPiece:any[] = []
  
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


  /////for fennnn. begins:
  setBoard() {

    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        if(this.setPiece(i,j) == true){
          
          const element = document.getElementById(j + ',' + i);
          if (element) {

              var piece = this.findPiece(i,j)
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
              svgHtml =`<img src='https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png' height="50" width = "50">`
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
  findPiece(r:number,c:number){


    for(let i = 0 ; i <= this.chessPieces.length;i++){
      if(this.chessPieces[i].x == r && this.chessPieces[i].y == c){
        return this.chessPieces[i].piece
      }
    }
    return 'nothing found'
  }
  setPiece(r:number,c:number){
    
    for(let i = 0; i < this.chessPieces.length; i++){
      if(this.chessPieces[i].x == r && this.chessPieces[i].y == c){
        return true
      }
    }
   

    return false;
  }

  fenConverter(){
    this.clearBoard();
    this.chessPieces = []
    const fen = this.fenStr;
    var flag = 0
    const dividedfen = fen.split('/')
    const lastfn = dividedfen[dividedfen.length - 1]
    const dividedlastfen = lastfn.split(' ')
    var row = 0;
    var col = 0;
    
    var add=0;
    dividedfen.forEach(fen=>{
      add=0;
      row++;

      for(let i = 1;i<=fen.length;i++){
        if(add + i >8){
          break;
        }
        if(fen[i-1] == ' '){
          break;
        }
        console.log(fen[i-1])
        if(fen[i-1] === 'r'||fen[i-1]==='b'||fen[i-1]==='n'||fen[i-1]==='k'||fen[i-1]==='q'||fen[i-1] === 'p'){
          this.chessPieces.push({x:row,y:i + add,piece: 'B'+fen[i-1].toUpperCase()})
        }
        if(fen[i-1] === 'R'||fen[i-1]==='B'||fen[i-1]==='N'||fen[i-1]==='K'||fen[i-1]==='Q'||fen[i-1] === 'P'){
          this.chessPieces.push({x:row,y:i +add,piece: 'W'+fen[i-1].toUpperCase()})
        }
        if(Number(fen[i-1])>=2){
          add += Number(fen[i-1]) - 1;
        }
        
      }
     
    })

    dividedlastfen.forEach(item=>{
        console.log(item)
    })
    console.log(this.chessPieces)
    this.setBoard();
  }
/////fen ends


  showAlert(title:string,msg:string) {
    Swal.fire({
      title: title,
      text: msg,
      icon: 'warning',
    });
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

      if (this.wMove == true) {
        this.bMove = true
        this.wMove = false

      } else {
        this.wMove = true;
        this.bMove = false
      }

      // console.log(this.checkingMove(x, y))

      if (this.checkMove(event.container.data[0], event.container.data[1], x, y) == true) {


        this.findandreplaceChessPieces(event.container.data[0], event.container.data[1], x, y)
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
          svgHtml = ` <svg    xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
    <path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z" style="opacity:1; fill:#000000; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"/>
  </svg>`;
        } else if (piece === 'BK') {
          svgHtml = `  <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='KING'&& col==1" xmlns='http://www.w3.org/2000/svg' version="1.1"width="45"height="45">
      <g style="fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
        <path d="M 22.5,11.63 L 22.5,6" style="fill:none; stroke:#000000; stroke-linejoin:miter;" id="path6570"/>
        <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" style="fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;"/>
        <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" style="fill:#000000; stroke:#000000;"/>
        <path d="M 20,8 L 25,8" style="fill:none; stroke:#000000; stroke-linejoin:miter;"/>
        <path d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5" style="fill:none; stroke:#ffffff;"/>
        <path d="M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37" style="fill:none; stroke:#ffffff;"/>
      </g>
    </svg>`
        } else if (piece === 'BQ') {
          svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col)=='QUEEN' && col==1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
      <g style="fill:#000000;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round">
    
        <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" style="stroke-linecap:butt;fill:#000000"/>
        <path d="m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z"/>
        <path d="M 11.5,30 C 15,29 30,29 33.5,30"/>
        <path d="m 12,33.5 c 6,-1 15,-1 21,0"/>
        <circle cx="6" cy="12" r="2"/>
        <circle cx="14" cy="9" r="2"/>
        <circle cx="22.5" cy="8" r="2"/>
        <circle cx="31" cy="9" r="2"/>
        <circle cx="39" cy="12" r="2"/>
        <path d="M 11,38.5 A 35,35 1 0 0 34,38.5" style="fill:none; stroke:#000000;stroke-linecap:butt;"/>
        <g style="fill:none; stroke:#ffffff;">
          <path d="M 11,29 A 35,35 1 0 1 34,29"/>
          <path d="M 12.5,31.5 L 32.5,31.5"/>
          <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"/>
          <path d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"/>
        </g>
      </g>
    </svg>`
        } else if (piece === 'BB') {
          svgHtml = ` <svg  cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col)=='BISHOP'&& col==1;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
      <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.6)">
        <g style="fill:#000000; stroke:#000000; stroke-linecap:butt;">
          <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"/>
          <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/>
          <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"/>
        </g>
        <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" style="fill:none; stroke:#ffffff; stroke-linejoin:miter;"/>
      </g>
    </svg>`
        } else if (piece === 'BN') {
          svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='KNIGHT'&& col==1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
      <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
        <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#000000; stroke:#000000;"/>
        <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#000000; stroke:#000000;"/>
        <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#ffffff; stroke:#ffffff;"/>
        <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#ffffff; stroke:#ffffff;"/>
        <path d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z " style="fill:#ffffff; stroke:none;"/>
      </g>
    </svg>`
        } else if (piece == 'BR') {
          svgHtml = `<svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col) == 'ROOK'&& col==1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
      <g style="opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
        <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z " style="stroke-linecap:butt;"/>
        <path d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z " style="stroke-linecap:butt;"/>
        <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z " style="stroke-linecap:butt;"/>
        <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z " style="stroke-linecap:butt;stroke-linejoin:miter;"/>
        <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z " style="stroke-linecap:butt;"/>
        <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z " style="stroke-linecap:butt;"/>
        <path d="M 12,35.5 L 33,35.5 L 33,35.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
        <path d="M 13,31.5 L 32,31.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
        <path d="M 14,29.5 L 31,29.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
        <path d="M 14,16.5 L 31,16.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
        <path d="M 11,14 L 34,14" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
      </g>
    </svg>`
        }
        ///White piece
        if (piece === 'WP') {
          svgHtml = ``
        } else if (piece === 'WQ') {
          svgHtml = ` <svg  cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col)=='WQ' && col==8" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
       <g style="fill:#ffffff;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round">
     
         <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" style="stroke-linecap:butt;fill:#ffffff"/>
         <path d="m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z"/>
         <path d="M 11.5,30 C 15,29 30,29 33.5,30"/>
         <path d="m 12,33.5 c 6,-1 15,-1 21,0"/>
         <circle cx="6" cy="12" r="2"/>
         <circle cx="14" cy="9" r="2"/>
         <circle cx="22.5" cy="8" r="2"/>
         <circle cx="31" cy="9" r="2"/>
         <circle cx="39" cy="12" r="2"/>
         <path d="M 11,38.5 A 35,35 1 0 0 34,38.5" style="fill:none; stroke:#000000;stroke-linecap:butt;"/>
         <g style="fill:none; stroke:#000000;">
           <path d="M 11,29 A 35,35 1 0 1 34,29"/>
           <path d="M 12.5,31.5 L 32.5,31.5"/>
           <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"/>
           <path d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"/>
         </g>
       </g>
     </svg>`
        } else if (piece === 'WB') {
          svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='WB'&& col==8;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
        <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.6)">
          <g style="fill:#ffffff; stroke:#000000; stroke-linecap:butt;">
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"/>
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/>
            <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"/>
          </g>
          <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" style="fill:none; stroke:#000000; stroke-linejoin:miter;"/>
        </g>
      </svg>`
        } else if (piece === 'WN') {
          svgHtml = `<svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='WN'&& col==8" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
        <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
          <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#ffffff; stroke:#000000;"/>
          <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#ffffff; stroke:#000000;"/>
          <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#000000; stroke:#000000;"/>
          <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#000000; stroke:#000000;"/>
          <path d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z " style="fill:#000000; stroke:none;"/>
        </g>
      </svg>`
        } else if (piece == 'WR') {
          svgHtml = `<svg  cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col) == 'WR'&& col==8" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
        <g style="opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
          <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z " style="stroke-linecap:butt;"/>
          <path d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z " style="stroke-linecap:butt;"/>
          <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z " style="stroke-linecap:butt;"/>
          <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z " style="stroke-linecap:butt;stroke-linejoin:miter;"/>
          <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z " style="stroke-linecap:butt;"/>
          <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z " style="stroke-linecap:butt;"/>
          <path d="M 12,35.5 L 33,35.5 L 33,35.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
          <path d="M 13,31.5 L 32,31.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
          <path d="M 14,29.5 L 31,29.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
          <path d="M 14,16.5 L 31,16.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
          <path d="M 11,14 L 34,14" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
        </g>
      </svg>`
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

    var diffColor = this.getPieceColor(x,y)
    var myColor = this.getPieceColor(myX,myY);
    console.log('detecting enemy works')
    if(diffColor == myColor){
      console.log('its our piece')
      return false;
    }else{
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
      this.showAlert('Invalid Move','Choose a Valid Move');('invalid move')
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
          svgHtml = ` <svg    xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
     <path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z" style="opacity:1; fill:#000000; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"/>
   </svg>`;
        } else if (piece === 'BK') {
          svgHtml = `  <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='KING'&& col==1" xmlns='http://www.w3.org/2000/svg' version="1.1"width="45"height="45">
       <g style="fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
         <path d="M 22.5,11.63 L 22.5,6" style="fill:none; stroke:#000000; stroke-linejoin:miter;" id="path6570"/>
         <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" style="fill:#000000;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;"/>
         <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" style="fill:#000000; stroke:#000000;"/>
         <path d="M 20,8 L 25,8" style="fill:none; stroke:#000000; stroke-linejoin:miter;"/>
         <path d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5" style="fill:none; stroke:#ffffff;"/>
         <path d="M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37" style="fill:none; stroke:#ffffff;"/>
       </g>
     </svg>`
        } else if (piece === 'BQ') {
          svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col)=='QUEEN' && col==1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
       <g style="fill:#000000;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round">
     
         <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" style="stroke-linecap:butt;fill:#000000"/>
         <path d="m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z"/>
         <path d="M 11.5,30 C 15,29 30,29 33.5,30"/>
         <path d="m 12,33.5 c 6,-1 15,-1 21,0"/>
         <circle cx="6" cy="12" r="2"/>
         <circle cx="14" cy="9" r="2"/>
         <circle cx="22.5" cy="8" r="2"/>
         <circle cx="31" cy="9" r="2"/>
         <circle cx="39" cy="12" r="2"/>
         <path d="M 11,38.5 A 35,35 1 0 0 34,38.5" style="fill:none; stroke:#000000;stroke-linecap:butt;"/>
         <g style="fill:none; stroke:#ffffff;">
           <path d="M 11,29 A 35,35 1 0 1 34,29"/>
           <path d="M 12.5,31.5 L 32.5,31.5"/>
           <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"/>
           <path d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"/>
         </g>
       </g>
     </svg>`
        } else if (piece === 'BB') {
          svgHtml = ` <svg  cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col)=='BISHOP'&& col==1;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
       <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.6)">
         <g style="fill:#000000; stroke:#000000; stroke-linecap:butt;">
           <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"/>
           <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/>
           <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"/>
         </g>
         <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" style="fill:none; stroke:#ffffff; stroke-linejoin:miter;"/>
       </g>
     </svg>`
        } else if (piece === 'BN') {
          svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='KNIGHT'&& col==1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
       <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
         <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#000000; stroke:#000000;"/>
         <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#000000; stroke:#000000;"/>
         <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#ffffff; stroke:#ffffff;"/>
         <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#ffffff; stroke:#ffffff;"/>
         <path d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z " style="fill:#ffffff; stroke:none;"/>
       </g>
     </svg>`
        } else if (piece == 'BR') {
          svgHtml = `<svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col) == 'ROOK'&& col==1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
       <g style="opacity:1; fill:#000000; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
         <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z " style="stroke-linecap:butt;"/>
         <path d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z " style="stroke-linecap:butt;"/>
         <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z " style="stroke-linecap:butt;"/>
         <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z " style="stroke-linecap:butt;stroke-linejoin:miter;"/>
         <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z " style="stroke-linecap:butt;"/>
         <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z " style="stroke-linecap:butt;"/>
         <path d="M 12,35.5 L 33,35.5 L 33,35.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
         <path d="M 13,31.5 L 32,31.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
         <path d="M 14,29.5 L 31,29.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
         <path d="M 14,16.5 L 31,16.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
         <path d="M 11,14 L 34,14" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
       </g>
     </svg>`
        }
        ///White piece
        if (piece === 'WP') {
          svgHtml = `  <svg (click)="showLegalMoves(row,col)" cdkDrag [cdkDragData]="` + x + ` ` + y + `"   xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
       <path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z" style="opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"/>
     </svg>`;
        } else if (piece === 'WK') {
          svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col"   *ngIf="getChessPiece(row,col)=='WK'&& col==8" xmlns='http://www.w3.org/2000/svg' version="1.1"width="45"height="45">
      <g style="fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;">
        <path d="M 22.5,11.63 L 22.5,6" style="fill:none; stroke:#000000; stroke-linejoin:miter;" id="path6570"/>
        <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" style="fill:#ffffff;fill-opacity:1; stroke-linecap:butt; stroke-linejoin:miter;"/>
        <path d="M 12.5,37 C 18,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 20,16 10.5,13 6.5,19.5 C 3.5,25.5 12.5,30 12.5,30 L 12.5,37" style="fill:#ffffff; stroke:#ffffff;"/>
        <path d="M 20,8 L 25,8" style="fill:none; stroke:#ffffff; stroke-linejoin:miter;"/>
        <path d="M 32,29.5 C 32,29.5 40.5,25.5 38.03,19.85 C 34.15,14 25,18 22.5,24.5 L 22.5,26.6 L 22.5,24.5 C 20,18 10.85,14 6.97,19.85 C 4.5,25.5 13,29.5 13,29.5" style="fill:none; stroke:#000000;"/>
        <path d="M 12.5,30 C 18,27 27,27 32.5,30 M 12.5,33.5 C 18,30.5 27,30.5 32.5,33.5 M 12.5,37 C 18,34 27,34 32.5,37" style="fill:none; stroke:#000000;"/>
      </g>
    </svg>`
        } else if (piece === 'WQ') {
          svgHtml = ` <svg  cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col)=='WQ' && col==8" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
        <g style="fill:#ffffff;stroke:#000000;stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round">
      
          <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" style="stroke-linecap:butt;fill:#ffffff"/>
          <path d="m 9,26 c 0,2 1.5,2 2.5,4 1,1.5 1,1 0.5,3.5 -1.5,1 -1,2.5 -1,2.5 -1.5,1.5 0,2.5 0,2.5 6.5,1 16.5,1 23,0 0,0 1.5,-1 0,-2.5 0,0 0.5,-1.5 -1,-2.5 -0.5,-2.5 -0.5,-2 0.5,-3.5 1,-2 2.5,-2 2.5,-4 -8.5,-1.5 -18.5,-1.5 -27,0 z"/>
          <path d="M 11.5,30 C 15,29 30,29 33.5,30"/>
          <path d="m 12,33.5 c 6,-1 15,-1 21,0"/>
          <circle cx="6" cy="12" r="2"/>
          <circle cx="14" cy="9" r="2"/>
          <circle cx="22.5" cy="8" r="2"/>
          <circle cx="31" cy="9" r="2"/>
          <circle cx="39" cy="12" r="2"/>
          <path d="M 11,38.5 A 35,35 1 0 0 34,38.5" style="fill:none; stroke:#000000;stroke-linecap:butt;"/>
          <g style="fill:none; stroke:#000000;">
            <path d="M 11,29 A 35,35 1 0 1 34,29"/>
            <path d="M 12.5,31.5 L 32.5,31.5"/>
            <path d="M 11.5,34.5 A 35,35 1 0 0 33.5,34.5"/>
            <path d="M 10.5,37.5 A 35,35 1 0 0 34.5,37.5"/>
          </g>
        </g>
      </svg>`
        } else if (piece === 'WB') {
          svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='WB'&& col==8;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
         <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.6)">
           <g style="fill:#ffffff; stroke:#000000; stroke-linecap:butt;">
             <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"/>
             <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/>
             <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"/>
           </g>
           <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" style="fill:none; stroke:#000000; stroke-linejoin:miter;"/>
         </g>
       </svg>`
        } else if (piece === 'WN') {
          svgHtml = `<svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='WN'&& col==8" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
         <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
           <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#ffffff; stroke:#000000;"/>
           <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#ffffff; stroke:#000000;"/>
           <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#000000; stroke:#000000;"/>
           <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#000000; stroke:#000000;"/>
           <path d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z " style="fill:#000000; stroke:none;"/>
         </g>
       </svg>`
        } else if (piece == 'WR') {
          svgHtml = `<svg  cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col) == 'WR'&& col==8" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
         <g style="opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
           <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z " style="stroke-linecap:butt;"/>
           <path d="M 12.5,32 L 14,29.5 L 31,29.5 L 32.5,32 L 12.5,32 z " style="stroke-linecap:butt;"/>
           <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z " style="stroke-linecap:butt;"/>
           <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z " style="stroke-linecap:butt;stroke-linejoin:miter;"/>
           <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z " style="stroke-linecap:butt;"/>
           <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 11,14 z " style="stroke-linecap:butt;"/>
           <path d="M 12,35.5 L 33,35.5 L 33,35.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
           <path d="M 13,31.5 L 32,31.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
           <path d="M 14,29.5 L 31,29.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
           <path d="M 14,16.5 L 31,16.5" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
           <path d="M 11,14 L 34,14" style="fill:none; stroke:#ffffff; stroke-width:1; stroke-linejoin:miter;"/>
         </g>
       </svg>`
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

}

