// import { Injectable } from '@angular/core';
// import { throwError } from 'rxjs';
// import {HttpClient,HttpErrorResponse}from "@angular/common/http"
// @Injectable({
//   providedIn: 'root'
// })
// export class UserServicesService {

//   constructor(private http: HttpClient) { }
//   private handleError(error:HttpErrorResponse)
//   {
//     if(error.status === 0)
//     {
//       console.error('An error occurred:', error.error);
//     }
//     else
//     {
//       console.error(`Backend returned code ${error.status}, body was: `, error.error)
//     }
//     return throwError(() => new Error('Something bad happened; please try again later.'));
//   }

//   getMoves(fen:String){
//     return this.http.post<any>("http://localhost:5000/getMove",{fen:fen});
//   }

//   getBoard(gameId:String){
//     return this.http.get<any>("http://localhost:3000/games/getGame?gameId=" + gameId+ " ");
//   }

//   getHistory(gameId:String){
//     return this.http.get<any>("http://localhost:3000/games/getHistory?uname=" + gameId+ " ");
//   }

//   verifyUser(user: any){

//     return this.http.post<any>("http://localhost:3000/User/verifyUser",user)

//   }
// }


import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {
  // Base URLs for your deployed services
  private authBase = 'https://chess-backend-b044.onrender.com';   // Render auth service
  private singleBase = 'https://moves-backend.onrender.com/';      // example single-player host (update)
  private gameBase = 'https://chess-app-api.onrender.com';       // example games host (update)

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  // Example: call single-player move generator
  getMoves(fen: string) {
    return this.http.post<any>(`http://localhost:5000/getMove`, { fen }).pipe(
      catchError(this.handleError)
    );
  }

  // Get game by id — note route path must match your backend route
  getBoard(gameId: string) {
    return this.http.get<any>(`${this.authBase}/games/getGame?gameId=${encodeURIComponent(gameId)}`).pipe(
      catchError(this.handleError)
    );
  }

  // Game history (update host if needed)
  getHistory(gameId: string) {
    return this.http.get<any>(`${this.authBase}/games/getHistory?uname=${encodeURIComponent(gameId)}`).pipe(
      catchError(this.handleError)
    );
  }

  // Verify user (auth)
  verifyUser(user: any) {
    return this.http.post<any>(`${this.authBase}/User/verifyUser`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Example createUser call (your /createUser endpoint)
  createUser(user: any) {
    return this.http.post<any>(`${this.authBase}/createUser`, user).pipe(
      catchError(this.handleError)
    );
  }
}
