let speed = 20;
let scale = 1; // Image scale (I work on 1080p monitor)
let canvas = document.getElementById("tv-screen") as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let logoColor;

if (window.innerWidth < 600) {
  scale = 0.3;
}

let dvd = {
  x: 200,
  y: 300,
  xspeed: 10,
  yspeed: 10,
  img: document.querySelector("#dvd") as HTMLImageElement,
};

console.log("Main");
canvas = document.getElementById("tv-screen")! as HTMLCanvasElement;
ctx = canvas.getContext("2d")!;
//   dvd.img.src = "";

//Draw the "tv screen"
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(window.innerWidth);

const shiny = ((Math.random() * 10) | 0) == 2;

setInterval(() => {
  if (!shiny) ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    dvd.img,
    dvd.x,
    dvd.y,
    dvd.img.width * scale,
    dvd.img.height * scale,
  );
  dvd.x += dvd.xspeed;
  dvd.y += dvd.yspeed;

  checkHitBox();
}, speed);

//Check for border collision
function checkHitBox() {
  if (dvd.x + dvd.img.width * scale >= canvas.width || dvd.x <= 0) {
    dvd.xspeed *= -1;
  }

  if (dvd.y + dvd.img.height * scale >= canvas.height || dvd.y <= 0) {
    dvd.yspeed *= -1;
  }
}
