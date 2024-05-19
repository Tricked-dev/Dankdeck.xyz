const { signIn } = await import("auth-astro/client");
const sl = <T>(r: string) => document.querySelector(r) as T;

sl<HTMLButtonElement>("#login-gh").onclick = () => signIn("github", {});
sl<HTMLButtonElement>("#login-dc").onclick = () => signIn("discord", {});
sl<HTMLButtonElement>("#login-rs").addEventListener("submit", (e) => {
  e.preventDefault();
  signIn("resend", {
    email: sl<HTMLButtonElement>("input[type=email]").value,
  });
});

const loginCount = parseInt(localStorage.getItem("loginCount") || 0);
localStorage.setItem("loginCount", (loginCount + 1).toString());

if (loginCount > 3) {
  sl<HTMLDivElement>(`#trouble`).classList.remove("hidden");
}

export {};
