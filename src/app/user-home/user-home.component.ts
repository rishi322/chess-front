import { Component,OnInit } from '@angular/core';
import { MoveService } from '../service/move.service';
import { webSocket } from 'rxjs/webSocket';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserServicesService } from '../userServices/user-services.service';



declare var particlesJS: any;
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  onlineUsers: Number=0;
  url:string = ''
  user_name:string =''
  history:any = []
  constructor(private sockeServices: MoveService,private router:Router,private http:HttpClient,private userServer:UserServicesService){
    
    const a = this.router.url.split('/');
  
    this.user_name = a[2];

    const getLocalUser = localStorage.getItem(this.user_name);
    if(!getLocalUser){
        localStorage.setItem(this.user_name,this.user_name);
    }else{
      
    }
    
   
   
  }

  ngOnInit(): void {
    
    this.sockeServices.sock$ = webSocket('ws://localhost:7070');
    const chessPieceImages = [
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png",

      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png",
      "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png",
      // Add more chess piece image URLs as needed
    ];
    particlesJS('particles-js-3', {
      particles: {
        number: {
          value: 15,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#000000"
        },
        shape: {
          type: "image",
          image: {
            src: chessPieceImages[Math.floor(Math.random() * 6)], // Use the first chess piece image initially
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0,
            sync: false
          }
        },
        size: {
          value: 15,
          random: true,
          anim: {
            enable: true,
            speed: 20,
            size_min: 10,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 300, // Adjust the distance between connected particles
          color: "#ffffff", // Set the color of the lines
          opacity: 0.6,
          width: 2
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: true,

          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 600
          }
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse"
          },
          onclick: {
            enable: false,
            mode: "push"
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 100, // Adjust the distance for repulsion
            duration: 0.4
          }
          // ... (other interactivity modes)
        }
      },
      retina_detect: true,
      fn: {
        init: function () {
          // This function is called after the particles.js configuration is initialized
          // Here, we will dynamically set a shuffled chess piece image for each particle
          particlesJS.fn.particlesInit({
            // Callback to create each particle
            fn: function (particle: any) {
              // Set a shuffled chess piece image URL for each particle
              particle.image.src = chessPieceImages.pop();

            }
          });
        }
      }
    });
     particlesJS('particles-js-2', {
      particles: {
        number: {
          value: 15,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#000000"
        },
        shape: {
          type: "image",
          image: {
            src: chessPieceImages[Math.floor(Math.random() * 6)], // Use the first chess piece image initially
            width: 100,
            height: 100
          }
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0,
            sync: false
          }
        },
        size: {
          value: 15,
          random: true,
          anim: {
            enable: true,
            speed: 20,
            size_min: 10,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 300, // Adjust the distance between connected particles
          color: "#ffffff", // Set the color of the lines
          opacity: 0.6,
          width: 2
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: true,

          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 600
          }
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse"
          },
          onclick: {
            enable: false,
            mode: "push"
          },
          resize: true
        },
        modes: {
          repulse: {
            distance: 100, // Adjust the distance for repulsion
            duration: 0.4
          }
          // ... (other interactivity modes)
        }
      },
      retina_detect: true,
      fn: {
        init: function () {
          // This function is called after the particles.js configuration is initialized
          // Here, we will dynamically set a shuffled chess piece image for each particle
          particlesJS.fn.particlesInit({
            // Callback to create each particle
            fn: function (particle: any) {
              // Set a shuffled chess piece image URL for each particle
              particle.image.src = chessPieceImages.pop();

            }
          });
        }
      }
    });
    this.getHistory();



    this.sockeServices.sock$.subscribe({
      next: () => {
        // Now that the connection is open, you can subscribe to messages
        this.sockeServices.sock$.subscribe((message) => {
          console.log(message)
            this.onlineUsers = message;
            console.log(this.onlineUsers);
          
        });
      },
      error: (err) => {
        console.error('WebSocket error:', err);
      },
    })

  }
  getHistory(){
    this.userServer.getHistory(this.user_name).subscribe((data)=>{
      this.history = data;
      console.log(data)
    })
  }
  logout(){
    const user = localStorage.removeItem(this.user_name);

    
  }

  buildUrl(){
    const length = 10; // You can customize the length as needed
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
     return result;
  }

  play(){
    console.log('play')
    const url = this.buildUrl()
    this.sockeServices.createGame(url,this.user_name);
  
    this.router.navigate(['./user/'+this.user_name + '/' +url])
  }

joinGame:boolean = true;
  join(){

    // this.sockeServices.joinGame(this.user_name,this.url)
  
    alert('join request sent');

    console.log('join request sent')
    
    this.sockeServices.findAndJoinGame(this.url,this.user_name).subscribe((data)=>{
      console.log(data)
      this.sockeServices.joinGame(this.url,this.user_name);
      const result = data
      alert(result.status)
      if(result.status == 1){
        this.router.navigate(['./user/'+this.user_name + '/'+this.url])
      }else{
        alert(result.message)
      }
    })

    
  }

  playwithc(){
    console.log("creating single player game window for user");
    this.router.navigate(['./singleplayer']);
    //this is a router to the computer window portal 
  }

 

}
