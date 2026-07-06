
import { Component,ComponentFactoryResolver, ElementRef, Renderer2 , ViewChild,OnInit, ViewContainerRef,ComponentRef} from '@angular/core';
import {
  
  CdkDragDrop,

  CdkDragMove,

  CdkDragEnter,
  CdkDragExit,

}  from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-pawn',
  templateUrl: './pawn.component.html',
  styleUrls: ['./pawn.component.css']
})
export class PawnComponent {

  

  chessPieces: any[];
  curPiece: string;
  item: any[];
  msg: string;
  boxes:any[];
  x:number[];
  y:number[]
  someContent: string = 'Initial Content'; 
  @ViewChild('elementToRefresh', { read: ViewContainerRef }) elementToRefresh!: ViewContainerRef;
  pawncomponent !: ComponentRef<PawnComponent>;
 
    
  

  constructor(public renderer: Renderer2,ViewContainerRef: ViewContainerRef,private componentFactoryResolver: ComponentFactoryResolver){
    this.msg ='msg'
    this.chessPieces = [];
    this.curPiece = ''
this.item=[];
this.boxes = [];
this.x = [1,2,3,4,5,6,7,8];
this.y = [1,2,3,4,5,6,7,8]
this.data = [];

  }
  ngAfterViewInit() {
    this.loadDynamicComponent();
    // It's safe to access ElementRef or ViewContainerRef here.
  }
  loadDynamicComponent() {
    if(this.elementToRefresh){
      const factory = this.componentFactoryResolver.resolveComponentFactory(PawnComponent);
      this.pawncomponent = factory.create(this.elementToRefresh.parentInjector);
      this.elementToRefresh.clear(); // Clear any previous content
      this.elementToRefresh.insert(this.pawncomponent.hostView);
    } else {
      console.log('error')
    }
  
  
    // Use a type assertion to cast the ComponentRef to the expected type (PawnComponent)
    this.pawncomponent.instance as PawnComponent;
  }
  ngOnInit(){
    
  
    

    for(let a = 0; a <64; a++){
      this.boxes[a] = a;
      
    }
    
      for(let i = 1; i <= 8; i++){
        for(let j = 1; j <= 8; j++){
          if( j==2)
          this.chessPieces.push({row: i, col: j, piece:'BP'})
        if(j==7)
        this.chessPieces.push({row:i,col:j,piece:'WP'})
          
          if(i == 1 && j == 1 || i == 1 &&j == 8 || i == 8 && j == 8 || i == 8 && j == 1){
            if(i==1 && j ==1 )
            this.chessPieces.push({row:i,col:j,piece:'BR'})
            if(i ==1 && j == 8)
            this.chessPieces.push({row:i,col:j,piece:'WR'})
            if(i == 8 && j == 1 )
            this.chessPieces.push({row:i,col:j,piece:'BR'})
            if( i == 8 && j == 8)
            this.chessPieces.push({row:i,col:j,piece:"WR"})
          } else if(i == 2 && j == 1 || i == 2 && j == 8 || i == 7 && j == 8 || i == 7 && j == 1){
  
            if(i==2 && j ==1 )
            this.chessPieces.push({row:i,col:j,piece:'BN'})
            if(i ==2 && j == 8)
            this.chessPieces.push({row:i,col:j,piece:'WN'})
            if(i == 7 && j == 8 )
            this.chessPieces.push({row:i,col:j,piece:'WN'})
            if( i == 7 &&j==1)
            this.chessPieces.push({row:i,col:j,piece:"BN"})
          } else if(i == 3 && j == 1 || i == 3 && j == 8 || i == 6 && j == 1 || i == 6 && j == 8){
            if(i==3 && j ==1 )
            this.chessPieces.push({row:i,col:j,piece:'BB'})
            if(i ==3 && j == 8)
            this.chessPieces.push({row:i,col:j,piece:'WB'})
            if(i == 6 && j == 1 )
            this.chessPieces.push({row:i,col:j,piece:'BB'})
            if( i == 6 && j == 8)
            this.chessPieces.push({row:i,col:j,piece:"WB"})
          } else if(i == 4 && j ==1 || i ==4 && j==8){
            if(i==4 && j ==1 )
            this.chessPieces.push({row:i,col:j,piece:'BQ'})
            if(i ==4 && j == 8)
            this.chessPieces.push({row:i,col:j,piece:'WQ'})
        
          } else if(i == 5 && j == 1 || i == 5 && j == 8){

            if(i ==5 && j == 8)
         
            this.chessPieces.push({row:i,col:j,piece:'WK'})
            if(i ==5 && j == 1)
            this.chessPieces.push({row:i,col:j,piece:'BK'})
          }
  
          
  
        }
      }
      console.log(this.chessPieces)
    
  }
  convertToString(x:number, y:number):string{
    if(x < 1 || x == 0){
      x = 1;
    } 
    if(y < 1 || y ==0){
      y = 1;
    }
    return x + ',' + y;
  }
  findandreplaceChessPieces(r:number,c:number,dr:number,dc:number){
    for(let i = 0; i <32; i++){
      if(this.chessPieces[i].row == r && this.chessPieces[i].col == c){
        console.log('found' + r, c)
        this.chessPieces[i].row = dr;
        this.chessPieces[i].col = dc
        return this.chessPieces[i]
        break;
      }else {
       
        console.log('not found' + this.chessPieces[i].row,this.chessPieces[i].col)
      }
    }
  }
  handlePieceMovement(event: CdkDragDrop<any[]>,r:number,c:number){
    
    
    // console.log(event.container.data)
    // console.log(event.distance)
    let dx = event.distance.x;
    let dy = event.distance.y
    
    let x , y = 0;
    let fx = 0;
    let fy = 0;
    console.log(dx,dy)
   if(event.distance.x <= 0){
    if(event.distance.x ==0){
      dx = 0
      fy = 0
      x = event.container.data[0]
    }else {
      dx *= -1;
      fx = 1;
      console.log(event.container.data[0])
      x = event.container.data[0] - Math.floor(dx/50);
    }
   } else {
    x = event.container.data[0] + Math.floor(dx/50);
   }
   if(event.distance.y <=0){

    if(event.distance.y ==0){
      dy = 0
      fy = 0
      y = event.container.data[1]
    }else{
      dy*= -1;
      fy =1;
      console.log('yes',event.container.data,dy)
      y = event.container.data[1]- Math.floor(dy/50) 
    }

   } else {
    
    y = event.container.data[1]+ Math.floor(dy/50) 
   }

       
     console.log(this.findandreplaceChessPieces(event.container.data[0],event.container.data[1],x,y))
    console.log(this.chessPieces)
    console.log(x,y)
    
    const a = this.convertToString(x,y)
    const b = this.convertToString(event.container.data[0],event.container.data[1])
    const hide = document.getElementById(b)
    if(hide){

      hide.innerHTML = ``;
    } else {
      console.log('error')
    }
    console.log(this.getChessPiece(event.container.data[0],event.container.data[1]))
    let piece = this.getChessPiece(x,y);
    let svgHtml = 'pawn'
    if(piece === 'BP'){
    svgHtml = `<div #pawnpiece>pawn</div>`;
    } else if(piece === 'BK'){
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
    }else if(piece ==='BQ'){
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
    }else if(piece === 'BB'){
      svgHtml= ` <svg  cdkDrag [cdkDragData]="row +' '+ col" *ngIf="getChessPiece(row,col)=='BISHOP'&& col==1;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
      <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.6)">
        <g style="fill:#000000; stroke:#000000; stroke-linecap:butt;">
          <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"/>
          <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/>
          <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"/>
        </g>
        <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" style="fill:none; stroke:#ffffff; stroke-linejoin:miter;"/>
      </g>
    </svg>`
    } else if(piece === 'BN'){
      svgHtml = ` <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='KNIGHT'&& col==1" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
      <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
        <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#000000; stroke:#000000;"/>
        <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#000000; stroke:#000000;"/>
        <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#ffffff; stroke:#ffffff;"/>
        <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#ffffff; stroke:#ffffff;"/>
        <path d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z " style="fill:#ffffff; stroke:none;"/>
      </g>
    </svg>`
    } else if(piece == 'BR'){
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
   
    
    if(piece === 'WP'){
      svgHtml = `  <svg cdkDrag [cdkDragData]="`+x +` `+ y+`"   xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
      <path d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z" style="opacity:1; fill:#ffffff; fill-opacity:1; fill-rule:nonzero; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:miter; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;"/>
    </svg>`;
      } else if(piece === 'WK'){
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
      }else if(piece ==='WQ'){
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
      }else if(piece === 'WB'){
        svgHtml= ` <svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='WB'&& col==8;" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
        <g style="opacity:1; fill:none; fill-rule:evenodd; fill-opacity:1; stroke:#000000; stroke-width:1.5; stroke-linecap:round; stroke-linejoin:round; stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.6)">
          <g style="fill:#ffffff; stroke:#000000; stroke-linecap:butt;">
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z"/>
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/>
            <path d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z"/>
          </g>
          <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" style="fill:none; stroke:#000000; stroke-linejoin:miter;"/>
        </g>
      </svg>`
      } else if(piece === 'WN'){
        svgHtml = `<svg cdkDrag [cdkDragData]="row +' '+ col"  *ngIf="getChessPiece(row,col)=='WN'&& col==8" xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
        <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
          <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#ffffff; stroke:#000000;"/>
          <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#ffffff; stroke:#000000;"/>
          <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#000000; stroke:#000000;"/>
          <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#000000; stroke:#000000;"/>
          <path d="M 24.55,10.4 L 24.1,11.85 L 24.6,12 C 27.75,13 30.25,14.49 32.5,18.75 C 34.75,23.01 35.75,29.06 35.25,39 L 35.2,39.5 L 37.45,39.5 L 37.5,39 C 38,28.94 36.62,22.15 34.25,17.66 C 31.88,13.17 28.46,11.02 25.06,10.5 L 24.55,10.4 z " style="fill:#000000; stroke:none;"/>
        </g>
      </svg>`
      } else if(piece == 'WR'){
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
    element.innerHTML = ''
    
    element.innerHTML = '  <div cdkDrag class="chess-piece" [ngClass]="{'+ x+','+y +'}" >' + svgHtml + `</div>`
    
    
    
  } else {
    console.error(`Element with ID '${a}' not found.`);
  }
  const ele1 = document.getElementById('pawnnnx')
  if(ele1){
    
    
  }

  }
 onStart(event:Event){
  console.log("drag"+ "started")
 }
 
  data:number[]
  chess=[1,2,3,4,5,6,7,8]
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  

  refreshElement() {
    // Perform any data fetching or updates here to refresh the content
    this.someContent = `<app-pawn></app-pawn>`;
    this.loadDynamicComponent();
    console.log('hi')
   
    // You can also use ElementRef to directly manipulate the element, for example, changing its text content:
    // this.elementToRefresh.nativeElement.textContent = 'Refreshed Content';
  }
  locateme(x:number, y:number, mx:number,my:number){
    if(x <0){
      x *= -1
    }
    if(y < 0){
      y *= -1
    }
    if(mx < 0){
      mx *= -1
    }
    if(my < 0 ){
      my *= -1
    }
    var dx = mx - x;
    var dy = my - y;
    if(dx < 0){
      
      dx *= -1;
    }
    if(dy < 0){
      dy *= -1;
    }
    console.log('lm'+dx,dy,x,y,mx,my)
    return [dx/50, dy/50];
  }
  move(event:CdkDragMove<any[]>){
  
  }
  enter(event:CdkDragEnter<any[]>){
    console.log(event)
    console.log('hi')
  }
  exit(event:CdkDragExit<any[]>){
    console.log('exited')
  }

 
 
  isChessPiece(row:number,col:number):boolean {

   
    const a = row;
    const b = col;
    for(let i = 0; i <this.chessPieces.length; i++){
      if(this.chessPieces[i]!== null){
        const x = this.chessPieces[i].row;
        if(this.chessPieces[i].row == a && this.chessPieces[i].col == b){
          if(this.chessPieces[i].piece !== null){
            this.curPiece = this.chessPieces[i].piece;
            return true;
          }
        }
      }
    }
    this.curPiece = ''
    return false;
  }

  getChessPiece(row:number,col:number):string{
    const a = row;
    const b = col;
    for(let i = 0; i <this.chessPieces.length; i++){
      if(this.chessPieces[i]!== null){
        const x = this.chessPieces[i].row;
        if(this.chessPieces[i].row == a && this.chessPieces[i].col == b){
          if(this.chessPieces[i].piece !== null){
            this.curPiece = this.chessPieces[i].piece;
            return this.chessPieces[i].piece;
          }
        }
      }
    }
     return ''
  }


}
