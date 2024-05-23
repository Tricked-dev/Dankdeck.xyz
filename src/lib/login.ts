const { signIn } = await import("auth-astro/client");
const sl = <T>(r: string) => document.querySelector(r) as T;

const r = new URLSearchParams(window.location.search).get("r") || "";

const callbackUrl = `${window.origin}${r}`;

sl<HTMLButtonElement>("#login-gh").onclick = () =>
  signIn("github", { callbackUrl });
sl<HTMLButtonElement>("#login-dc").onclick = () =>
  signIn("discord", { callbackUrl });
sl<HTMLButtonElement>("#login-rs").addEventListener("submit", (e) => {
  e.preventDefault();
  sl<HTMLSpanElement>(".loading").classList.remove("hidden");
  sl<HTMLButtonElement>("#login-rs > button").disabled = true;
  signIn("resend", {
    email: sl<HTMLButtonElement>("input[type=email]").value,
    callbackUrl,
  });
});

const loginCount = parseInt(localStorage.getItem("loginCount") || " 0");
localStorage.setItem("loginCount", (loginCount + 1).toString());

if (loginCount > 3) {
  sl<HTMLDivElement>(`#trouble`).classList.remove("hidden");
}

export {};
