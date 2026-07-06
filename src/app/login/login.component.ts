import { Component, OnInit } from '@angular/core';
declare var particlesJS: any;
import { UserServicesService } from '../userServices/user-services.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  email: string = '';
  password:string = '';
  user:{email:string,password:string} = {email:'',password:''};

  constructor(private getuser: UserServicesService,private router:Router){
   
  }

  
  ngOnInit(): void {



    // Define an array of chess piece image URLs
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

    // Function to shuffle the chessPieceImages array

    // Shuffle the chessPieceImages array

    const rotatedChessPieceImages = chessPieceImages.map((src) => {
      const angle = Math.random() * 360; // Rotate by a random angle between 0 and 360 degrees
      return 'rotateImage(' + src + ',' + angle + ')';
    });
    // Initialize particles.js with dynamic chess piece images and connected lines
    // 

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
    const color=['#ffffff','blue','white','orange']
    particlesJS('particles-js-2', {
      particles: {
        number: {
          value: 10,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "random"
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
          value: 1,
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
          enable: false,
          distance: 300, // Adjust the distance between connected particles
          color: "#fffffff", // Set the color of the lines
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
    particlesJS('particles-js', {
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
          distance: 250, // Adjust the distance between connected particles
          color: "#ffffff", // Set the color of the lines
          opacity: 0.6,
          width: 2
        },
        move: {
          enable: true,
          speed: 7,
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


    // Use the 'particles' variable if needed (e.g., for controlling the animation)

  }

  verifyUser(){
   
    this.getuser.verifyUser(this.user).subscribe((data)=>{
      console.log(data)
      console.log(data.data[0].userName)

      if(data.status == 1){
    
          const url = data.data[0].userName
          alert(url)
          
          this.router.navigate(['./user/'+url])
      }else{
        alert(data.data)
      }
    })

    
  }
}