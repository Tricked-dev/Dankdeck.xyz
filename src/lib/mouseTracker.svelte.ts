export const mouse = $state({
  x: 0,
  y: 0,
});

declare global {
  interface Window {
    mouseLoaded: boolean;
  }
}

if (typeof window !== "undefined" && !window.mouseLoaded) {
  window.mouseLoaded = true;
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
}
