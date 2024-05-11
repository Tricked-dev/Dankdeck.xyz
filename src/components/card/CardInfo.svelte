<script lang="ts">
  import type { BinAuction, Card as CardType } from "@db/schema.ts";
  import type { getSession } from "auth-astro/server";
  import Card from "./Card.svelte";
  import Money from "@/components/icons/Money.svelte";
  import Modal from "@/components/Modal.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import { tr, trpc } from "@/lib/api";
  import { TRPCClientError } from "@trpc/client";
  import { setUserInfo } from "@/lib/state.svelte";

  interface Props {
    card: CardType;
    session: Awaited<ReturnType<typeof getSession>>;
  }
  let { card: c, session }: Props = $props();
  let card = $state(c);
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
  let buyDialog: HTMLDialogElement | undefined = $state();
  let sellPrice = $state(3);

  $effect(() => {
    if (sellPrice > 9999999) sellPrice = 9999999;
    if (sellPrice < 1) sellPrice = 3;
  });

  async function sell() {
    await tr(async () => {
      let bin = (await trpc.sell.mutate({
        cardId: card.id,
        price: sellPrice,
      })) as unknown as BinAuction;

      toast.success("Successfully selling card");
      card.auction.push(bin);
      sellDialog?.close();

      let user = await trpc.user.query();
      setUserInfo(user);
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
      {#if session?.user?.id === card.userId}
        {#if card.auction?.[0]?.price}
          <button
            class="btn btn-lg w-[50%] max-w-[15rem]"
            disabled={false}
            onclick={async () => {
              await tr(async () => {
                await trpc.cancel.mutate({
                  cardId: card.id,
                });
                toast.success("Successfully cancelled auction");
                card.auction = [];
              });
            }}
          >
            Cancel auction
          </button>
        {:else}
          <button
            class="btn btn-lg w-[50%] max-w-[15rem]"
            onclick={() => {
              sellDialog?.showModal();
            }}
            disabled={false}
          >
            Sell
          </button>
        {/if}
      {:else if !session?.user?.id}
        <button class="btn btn-lg w-[50%] max-w-[15rem]" disabled={true}>
          Not logged in
        </button>
      {:else if card.auction?.[0]?.price}
        <button
          class="btn btn-lg w-[50%] max-w-[15rem]"
          onclick={() => {
            buyDialog?.showModal();
          }}
          disabled={false}
        >
          Buy card for <Money />
          {card.auction?.[0]?.price}
        </button>
      {:else}
        <button class="btn btn-lg w-[50%] max-w-[15rem]" disabled={true}>
          Card not for sale
        </button>
      {/if}

      <button
        class="btn btn-lg w-[50%] max-w-[10rem]"
        onclick={() => {
          window.open(
            `/trade/${crypto?.randomUUID?.() ?? (Math.random() * 9999) | 0}`,
          );
        }}>Trade</button
      >
    </div>

    <div>
      Obtained: {new Date(card.createdAt)?.toISOString()}<br />
      <!-- Last Sold for: ${card.last_sold_for}<br /> -->
      Owned by:
      <a class="link link-hover" href="/users/{card.userId}">{card.user.name}</a
      >
      {#if card?.meme.year}
        <br />
        Year: {card?.meme.year}
      {/if}
      {#if card?.meme.origin}
        <br />
        Origin: {card?.meme.origin}
      {/if}
      {#if card?.meme.description}
        <br />
        Description: {card?.meme.description}
      {/if}
      {#if card?.meme.partOf}
        <br />
        Part of: {card?.meme.partOf}
      {/if}
      {#if card?.meme.type}
        <br />
        Type: {card?.meme.type}
      {/if}
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

<Modal title="Sell {card?.meme.name}" bind:modal={sellDialog}>
  <label class="form-control w-full mt-2">
    <div class="label">
      <span class="label-text">Sell price:</span>
    </div>
    <label class="input input-bordered flex items-center gap-2">
      <Money />
      <input
        type="number"
        class="grow"
        min="3"
        max="9999999"
        bind:value={sellPrice}
      />
    </label>
    <div class="label">
      <span class="label-text-alt"
        >It will cost you <Money />
        {Math.ceil(sellPrice * 0.05)} to put this item up</span
      >
    </div>
  </label>
  <div class="mt-4 flex gap-4">
    <button class="ml-auto btn btn-primary min-w-24 text-base" onclick={sell}
      >Sell</button
    >
    <button
      class="btn min-w-24 btn-outline text-base"
      onclick={() => {
        sellPrice = 3;
        sellDialog?.close();
      }}
    >
      Cancel
    </button>
  </div>
</Modal>

<Modal title="Buy {card.meme.name}" bind:modal={buyDialog}>
  <span class="text-1xl">Buy price: <Money /> {card.auction?.[0]?.price}</span>

  <div class="mt-4 flex gap-4">
    <button
      class="ml-auto btn btn-primary min-w-24"
      onclick={async () => {
        await tr(async () => {
          await trpc.buy.mutate({
              cardId: card.id,
              price: card.auction[0]?.price,
          });
          card =( await trpc.card.query({ cardId: card.id })) as unknown as CardType;
          buyDialog?.close();

          let user = await trpc.user.query();
          setUserInfo(user);
        })
      }}
    >
      Buy
    </button>
    <button
      class="btn btn-ghost min-w-24"
      onclick={async () => {
        buyDialog?.close();
      }}
    >
      Cancel
    </button>
  </div>
</Modal>
