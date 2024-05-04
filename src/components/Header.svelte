<script lang="ts">
  import type { getSession } from "auth-astro/server";
  import { signOut } from "auth-astro/client";
  import Money from "./Money.svelte";
  import { onMount } from "svelte";
  let { session }: { session: Awaited<ReturnType<typeof getSession>> } =
    $props();

  let balance = $state(0);
  let balanceElement = $state<HTMLElement | undefined>(undefined);
  //https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el: HTMLElement) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight ||
          document.documentElement.clientHeight) /* or $(window).height() */ &&
      rect.right <=
        (window.innerWidth ||
          document.documentElement.clientWidth) /* or $(window).width() */
    );
  }

  let visible = $state(true);

  async function updateBalance() {
    let res = await fetch("/api/balance");
    if (res.ok) {
      let t = await res.json();
      console.log(t);
      balance = t.data.balance;
      localStorage.setItem("balance", balance.toString());
    }
  }

  onMount(() => {
    balance = parseInt(localStorage.getItem("balance") ?? "0");
    updateBalance();
    let interval = setInterval(
      async () => {
        if (!balanceElement) return;
        if (!isElementInViewport(balanceElement)) return;
        if (!visible) return;
        await updateBalance();
      },
      1000 * 60 * 5 /* 5 minutes */,
    );

    return () => clearInterval(interval);
  });
</script>

<svelte:document
  onvisibilitychangecapture={() => {
    if (document.visibilityState === "visible") {
      visible = true;
      updateBalance();
    } else {
      visible = false;
    }
  }}
/>

<div class="navbar bg-base-300">
  <div class="flex-1 flex gap-2">
    <a href="/" class="btn btn-ghost text-xl">Card Thingy</a>
    <a href="/cards" class="btn btn-outline text-xl">My Cards</a>
  </div>

  <div class="flex-none gap-2">
    <div class="p-2 bg-base-200 rounded-2xl w-20">
      <span class="text-primary" bind:this={balanceElement}><Money /></span>
      {balance}
    </div>

    <div class="form-control">
      <button
        class="btn"
        onclick={async () => {
          await fetch("/api/roll");
          window.location.reload();
        }}
      >
        Roll new card
      </button>
    </div>

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img alt="Tailwind CSS Navbar component" src={session?.user?.image} />
        </div>
      </div>
      <ul
        tabindex="0"
        class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <a class="justify-between">
            Profile
            <span class="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li
          onclick={() => {
            signOut();
            window.location.href = "/login";
          }}
        >
          <a>Logout</a>
        </li>
      </ul>
    </div>
  </div>
</div>
