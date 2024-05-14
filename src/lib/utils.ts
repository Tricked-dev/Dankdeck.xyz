import { mouse } from "./mouseTracker.svelte";

let sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function doConfetti(
  element: HTMLElement | undefined,
  sprays: {
    p: number;
    s: number;
    a: number;
    v: number;
  }[],
  canvas?: HTMLCanvasElement,
) {
  let { default: conf, create } = await import("canvas-confetti");

  let x: number;
  let y: number;
  if (element) {
    const { top, height, left, width } = element.getBoundingClientRect();
    x = (left + width / 2) / window.innerWidth;
    y = (top + height / 2) / window.innerHeight;
  } else {
    x = mouse.x / window.innerWidth;
    y = mouse.y / window.innerHeight;
  }

  let myConfetti = canvas
    ? create(canvas, {
        resize: true,
        useWorker: false,
      })
    : conf;

  for (const spray of sprays) {
    await sleep(100);
    myConfetti({
      particleCount: spray.p,
      spread: spray.s,
      angle: spray.a,
      startVelocity: spray.v,
      origin: {
        x,
        y,
      },
    });
  }
}
