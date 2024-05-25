let speed = 20;
let scale = 1;
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

canvas = document.getElementById("tv-screen")! as HTMLCanvasElement;
ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const shiny = ((Math.random() * 10) | 0) == 2;

function update() {
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
}

setInterval(update, speed);

//Check for border collision
function checkHitBox() {
  if (dvd.x + dvd.img.width * scale >= canvas.width || dvd.x <= 0) {
    dvd.xspeed *= -1;
  }

  if (dvd.y + dvd.img.height * scale >= canvas.height || dvd.y <= 0) {
    dvd.yspeed *= -1;
  }
}
