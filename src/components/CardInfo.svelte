<script lang="ts">
  import type { Card as CardType } from "@db/schema";
  import type { CreateAuction } from "../lib/interfaces";
  import type { getSession } from "auth-astro/server";
  import Card from "./Card.svelte";
  import Money from "./Money.svelte";
  interface Props {
    card: CardType;
    session: Awaited<ReturnType<typeof getSession>>;
  }
  let { card, session }: Props = $props();
  const tradeHistory = [
    {
      date: Date.now(),
      type: "sold",
      price: 20,
    },
    {
      date: Date.now(),
      type: "obtained",
    },
  ];
  let sellDialog: HTMLDialogElement | undefined = $state();
  let sellPrice = $state(1);

  $effect(() => {
    if (sellPrice > 9999999) sellPrice = 9999999;
    if (sellPrice < 1) sellPrice = 1;
  });

  async function sell() {
    let body: CreateAuction = {
      cardId: card.id,
      price: sellPrice,
    };
    await fetch(`/api/sell`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
</script>

<div class="flex w-full p-4 gap-8 max-w-[80rem] mx-auto">
  <span class="text-4xl font-bold">
    {card.meme.name}
  </span>
</div>
<!--
TODO: make text better vosible on light backgrounds

-->
<div class="h-full flex w-full p-4 gap-8 max-w-[80rem] mx-auto">
  <div class="h-full">
    <Card {card} height={30} />
  </div>
  <div class="h-full w-[50%] flex flex-col gap-2">
    <div class="flex gap-2 w-full">
      <button
        class="btn btn-lg w-[50%] max-w-[10rem]"
        onclick={() => {
          sellDialog?.showModal();
        }}
        disabled={session?.user?.id != card.userId}>Sell</button
      >
      <button class="btn btn-lg w-[50%] max-w-[10rem]" disabled>Trade</button>
    </div>

    <div>
      Obtained: {card.createdAt?.toISOString()}<br />
      <!-- Last Sold for: ${card.last_sold_for}<br /> -->
      Owned by: {card.user.name}
    </div>

    <div class="mt-auto">
      <span class="text-2xl font-semibold">Trade History</span>
      <div class="bg-base-300 h-72 rounded-sm p-1">
        {#each tradeHistory as item}
          <div>
            {item.type}
            {new Date(item.date).toISOString()}
            {item.price}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<dialog class="modal" bind:this={sellDialog} id="sellModal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</button
      >
    </form>
    <h3 class="font-bold text-lg">Sell {card.meme.name}</h3>

    <div class="label">
      <span class="label-text">Sell price:</span>
    </div>
    <label class="input input-bordered flex items-center gap-2">
      <Money />
      <input
        type="number"
        class="grow"
        min="1"
        max="9999999"
        bind:value={sellPrice}
      />
    </label>
    <div class="mt-4 flex gap-4">
      <button class="ml-auto btn btn-primary min-w-24" onclick={sell}
        >Sell</button
      >
      <button
        class="btn btn-ghost min-w-24"
        onclick={() => {
          sellPrice = 1;
          sellDialog?.close();
        }}>Cancel</button
      >
    </div>
  </div>
  <button class="modal-backdrop" onclick={() => sellDialog?.close()}></button>
</dialog>
