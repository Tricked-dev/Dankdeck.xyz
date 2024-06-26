<script lang="ts">
  import type { getSession } from "auth-astro/server";
  import { signOut } from "auth-astro/client";
  import Money from "@/components/icons/Money.svelte";
  import { onMount } from "svelte";
  import r, { setCards, setUserInfo } from "@/lib/state.svelte";
  import { DAY, claimDelay, dailyMoney } from "@/lib/interfaces";
  import Modal from "./Modal.svelte";
  import { tr, trpc } from "@/lib/api";
  import { Toaster } from "svelte-french-toast";
  import { doConfetti } from "@/lib/utils";
  import type { Card as CardType } from "@db/schema";
  import Avatar from "./Avatar.svelte";
  import { navigate } from "astro/virtual-modules/transitions-router.js";
  import Card from "./card/Card.svelte";
  import { fade, fly } from "svelte/transition";
  import { prefetch } from "astro:prefetch";
  let {
    session,
    title,
    hideTitle,
  }: {
    session: Awaited<ReturnType<typeof getSession>>;
    title: string;
    hideTitle: boolean;
  } = $props();

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

  async function updateUser() {
    await tr(async () => {
      let user = await trpc.user.query();
      // console.log(t);
      if (!r.user) {
        timeLeft = Math.max(
          DAY - (+new Date() - +new Date(user.dailyClaimedAt!)),
          0,
        );
        if (timeLeft == 0) {
          dailyPopup?.showModal();
        }
      }
      setUserInfo(user);
      balance = user.balance;
      localStorage.setItem("balance", balance.toString());
      localStorage.setItem("lastClaimedAt", new Date().toString());
      runCountDown();
    });
  }

  let timeLeft = $state(0);

  function runCountDown() {
    let lastClaimedAt = +new Date(r.user?.cardClaimedAt ?? 0);
    if (!r.user?.cardClaimedAt) {
      lastClaimedAt = parseInt(localStorage.getItem("lastClaimedAt") ?? "0");
    }

    timeLeft = Math.max(claimDelay - (+new Date() - lastClaimedAt), 0);
  }

  onMount(() => {
    if (!session) return;
    balance = parseInt(localStorage.getItem("balance") ?? "0");
    updateUser();
    runCountDown();
    let interval = setInterval(
      async () => {
        if (!balanceElement) return;
        if (!isElementInViewport(balanceElement)) return;
        if (!visible) return;
        await updateUser();
      },
      1000 * 60 * 5 /* 5 minutes */,
    );

    let interval2 = setInterval(() => {
      runCountDown();
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
    };
  });

  let loader: HTMLDivElement | undefined = $state();

  let rollBtn: HTMLButtonElement | undefined = $state();

  onMount(() => {
    const showLoaderAfter = 500;
    let hasLoaded = false;
    let before = () => {
      setTimeout(() => {
        if (hasLoaded) return;
        loader?.classList.remove("hidden");
      }, showLoaderAfter);
    };
    let after = () => {
      hasLoaded = true;
      loader?.classList.add("hidden");
      setTimeout(() => {
        loader?.classList.add("hidden");
      }, showLoaderAfter);
    };
    document.addEventListener("astro:before-preparation", before);
    document.addEventListener("astro:after-preparation", after);

    return () => {
      document.removeEventListener("astro:before-preparation", before);
      document.removeEventListener("astro:after-preparation", after);
    };
  });
  let dailyPopup: HTMLDialogElement | undefined = $state();

  let newCard = $state<CardType | undefined>(undefined);
</script>

<svelte:document
  onvisibilitychangecapture={() => {
    if (document.visibilityState === "visible") {
      visible = true;
      if (!session) return;
      updateUser();
    } else {
      visible = false;
    }
  }}
/>

{#snippet gameInfo(clazz)}
  <div class="p-2 bg-base-200 rounded-2xl w-32 {clazz}">
    <span class="text-primary" bind:this={balanceElement}><Money /></span>
    {#key r.user?.balance ?? balance}
      <span in:fade={{ duration: 250 }}>{r.user?.balance ?? balance}</span>
    {/key}
  </div>

  <div class="form-control {clazz}">
    {#if timeLeft > 0}
      <button class="btn" bind:this={rollBtn} disabled={true}>
        Roll new card {Math.ceil(timeLeft / 1000)}s left
      </button>
    {:else}
      <li class="list-none">
        <button
          class="btn"
          bind:this={rollBtn}
          onclick={async () => {
                doConfetti(undefined, [
                  { p: 150, s: 120, a: -130, v: 25 + Math.random() * 5 },
                  { p: 110, s: 100, a: -100, v: 40 + Math.random() * 10 },
                  { p: 150, s: 300, a: -140, v: 35 + Math.random() * 6 },
                  { p: 300, s: 50, a: -160, v: 30 + Math.random() * 20 },
                ]);
                await tr(async () => {
                 const card= await trpc.roll.query();
                 newCard = card;
                 setTimeout(() => {
                  newCard = undefined;
                 },2500)
                  await updateUser();
                  let cards = await trpc.mycards.query() as unknown[] as CardType[];
                  setCards(cards);
                });
              }}
        >
          Roll new card
        </button>
      </li>
    {/if}
  </div>
{/snippet}

<div class="navbar bg-base-300 gap-4 md:gap-0 relative">
  <div class="flex-1 flex gap-2">
    <a href="/" class="btn btn-ghost text-xl gap-0">Dank Deck</a>
    {#if session}
      <a href="/cards" class="btn btn-outline text-xl">My Cards</a>
    {/if}
  </div>

  <div class="flex-none gap-2">
    {#if session}
      {@render gameInfo("hidden md:block")}

      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost btn-circle avatar"
          ondblclick={() => {
            navigate("/user/" + session?.user?.id);
          }}
          onclick={() => {
            prefetch("/settings");
            prefetch("/user/" + session?.user?.id);
          }}
        >
          <div class="w-10 rounded-full">
            <Avatar user={session?.user} size={2.5} />
          </div>
        </div>
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          {@render gameInfo("block md:hidden py-2 w-full")}
          <li>
            <a class="justify-between" href="/user/{session?.user?.id}">
              Profile
            </a>
          </li>
          <li><a href="/settings">Settings</a></li>
          <li
            onclick={async () => {
              await fetch("/api/clearCookies");
              const cookies = document.cookie.split(";");

              for (var i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
                document.cookie =
                  name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
              }

              await signOut();

              setTimeout(() => {
                window.location.href = "/login";
              }, 3000);
            }}
          >
            <a>Logout</a>
          </li>
        </ul>
      </div>
    {:else}
      <button
        class="btn btn-outline btn-primary w-52 animate-pulse tooltip tooltip-bottom"
        data-tip="Or create an account :)"
        onclick={async () => {
          await fetch("/api/clearCookies");

          window.location.href = `/login?r=${window.location.pathname}`;
        }}
      >
        Login into DankDeck
      </button>
    {/if}
  </div>
  {#if !hideTitle}
    <span
      class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-3xl hidden md:block"
      >{title}</span
    >
  {/if}
</div>
{#if !hideTitle}
  <div class="w-full text-2xl md:hidden bg-base-300 text-center p-4">
    <span class="w-full">
      {title}
    </span>
  </div>
{/if}

<Toaster />

<Modal bind:modal={dailyPopup} title="Daily Cash" width="max-w-[32rem]">
  <div class="mt-8 mb-10 flex flex-col items-center">
    <Money width="w-24" height="h-24" />
    <p class="text-2xl font-bold my-2">Congratulation!</p>

    <p class="flex items-center gap-1">
      You have been awarded with <Money />
      {dailyMoney} for being a loyal user.
    </p>
  </div>
  <div class="flex gap-3">
    <button
      class="btn btn-outline ml-auto"
      onclick={() => {
        dailyPopup?.close();
      }}>Procrastinate</button
    >
    <button
      class="btn btn-primary items-center gap-1"
      onclick={async () => {
        //TODO: fancy money up animation
        await trpc.daily.query();
        setUserInfo({
          ...r.user,
          balance: (r.user?.balance ?? 0) + dailyMoney,
        });
        await updateUser();
        dailyPopup?.close();
      }}
    >
      Claim<Money />{dailyMoney}
    </button>
  </div>
</Modal>

<div
  bind:this={loader}
  class="loader-container w-full h-2 overflow-hidden relative hidden"
>
  <div class="stripe-l h-full absolute w-full bg-sky-600"></div>
  <div class="stripe-f h-full absolute w-44 bg-cyan-700"></div>
</div>

{#if newCard}
  <div
    class="absolute right-0 md:right-28 top-16 z-50"
    in:fly={{ y: -300, duration: 750 }}
    out:fly={{ y: -300, duration: 750 }}
  >
    <Card card={newCard} height={15}></Card>
  </div>
{/if}

<style>
  .stripe-l {
    animation: slide 5s linear infinite; /* Animation: slide for 2 seconds infinitely */
  }

  .stripe-f {
    animation: slide 2s linear infinite; /* Animation: slide for 2 seconds infinitely */
  }

  @keyframes slide {
    0% {
      left: -100%;
    } /* Start off-screen left */
    100% {
      left: 100%;
    } /* End off-screen right */
  }
</style>
