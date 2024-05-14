<script lang="ts">
  import type { BinAuction, Card as CardType } from "@db/schema.ts";
  import type { getSession } from "auth-astro/server";
  import Card from "./Card.svelte";
  import Money from "@/components/icons/Money.svelte";
  import Modal from "@/components/Modal.svelte";
  import toast from "svelte-french-toast";
  import { tr, trpc } from "@/lib/api";
  import { setUserInfo } from "@/lib/state.svelte";
  import UserLink from "../UserLink.svelte";
  import DateView from "../DateView.svelte";
  import Eye from "@/components/icons/Eye.svelte";
  import Auction from "@/components/icons/Auction.svelte";
  import MoneyBill from "@/components/icons/MoneyBill.svelte";
  import Clock from "@/components/icons/Clock.svelte";
  import TextLine from "@/components/icons/TextLine.svelte";
  import Details from "@/components/icons/Details.svelte";
  import Chart from "@/components/Chart.svelte";
  import ChartIcon from "@/components/icons/ChartIcon.svelte";
  import MoreSquare from "@/components/icons/MoreSquare.svelte";

  interface Props {
    card: CardType;
    session: Awaited<ReturnType<typeof getSession>>;
    suggestions: BinAuction[];
    randomSuggestions: boolean;
  }
  let { card: c, session, suggestions, randomSuggestions }: Props = $props();
  let card: CardType = $state(c);

  let sellDialog: HTMLDialogElement | undefined = $state();
  let buyDialog: HTMLDialogElement | undefined = $state();
  let sellPrice = $state(3);

  $effect(() => {
    if (sellPrice > 9999999) sellPrice = 9999999;
    if (sellPrice < 1) sellPrice = 3;
  });

  async function sell(e?: SubmitEvent | any) {
    e?.preventDefault?.();
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

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const chartOptions = {
    series: [
      {
        name: "Price",
        data: [
          [new Date("2022-01-01T00:00:00"), 20],
          [new Date("2022-02-01T00:00:00"), 30],
          [new Date("2022-03-01T00:00:00"), 40],
          [new Date("2022-04-01T00:00:00"), 10],
          [new Date("2022-05-01T00:00:00"), 30],
        ],
      },
    ],
    chart: {
      type: "area",
      height: 250,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
    },
    yaxis: {
      title: {
        text: "Price",
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
  };
</script>

<!--<div class="flex w-full p-4 gap-8 max-w-[80rem] mx-auto">-->
<!--  <span class="text-4xl font-bold">-->
<!--    {card.meme.name}-->
<!--    {#if session?.user?.id === card.userId}-->
<!--      <button-->
<!--        class="btn btn-outline btn-success btn-sm align-bottom"-->
<!--        onclick={() =>-->
<!--          tr(async () => {-->
<!--            trpc.picture.mutate({-->
<!--              memeId: card.meme.id,-->
<!--            });-->
<!--          })}>Set As Profile Picture</button-->
<!--      >-->
<!--    {/if}-->
<!--  </span>-->
<!--</div>-->
<!--
TODO: make text better vosible on light backgrounds

-->
<div
  class="h-full flex w-full p-4 gap-8 max-w-[80rem] mx-auto mt-2 justify-center"
>
  <div class="h-full">
    <Card {card} height={30} />

    <div
      class="join join-vertical w-full card card-compact shadow-xl bg-base-200 mt-5 w-[26.25rem]"
    >
      {#if card?.meme.description}
        <div
          class="collapse collapse-arrow join-item border rounded-lg border border-neutral"
        >
          <input type="checkbox" checked="checked" />
          <div class="collapse-title font-bold flex gap-3">
            <i class="flex w-7 h-7 stroke-white">
              <TextLine />
            </i>
            Description
          </div>
          <div class="collapse-content border-t border-neutral">
            <div class="pt-4">{card?.meme.description}</div>
          </div>
        </div>
      {/if}
      <div
        class="collapse collapse-arrow join-item border rounded-lg border border-neutral"
      >
        <input type="checkbox" />
        <div class="collapse-title font-bold flex gap-3 flex items-center">
          <i class="flex w-6 h-6 fill-white scale-95">
            <Details />
          </i>
          Details
        </div>
        <div class="collapse-content border-t border-neutral">
          <div class="pt-4 grid grid-cols-[auto_1fr] items-center">
            {#if card?.meme.year}
              <div class="font-semibold">Year</div>
              <div class="text-right text-sm">{card?.meme.year}</div>
            {/if}
            {#if card?.meme.origin}
              <div class="font-semibold">Origin</div>
              <div class="text-right text-sm">{card?.meme.origin}</div>
            {/if}
            {#if card?.meme.description}
              <div class="font-semibold">Description</div>
              <div class="text-right text-sm">{card?.meme.description}</div>
            {/if}
            {#if card?.meme.partOf}
              <div class="font-semibold">Part of</div>
              <div class="text-right text-sm">{card?.meme.partOf}</div>
            {/if}
            {#if card?.meme.type}
              <div class="font-semibold">Type</div>
              <div class="text-right text-sm">{card?.meme.type}</div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="h-full w-[50%] flex flex-col gap-2">
    <div
      class="font-bold text-sky-600 uppercase hover:text-sky-300 hover:underline transition-all"
    >
      {#if card.meme.year}
        Part of the {card.meme.year} collection
      {:else}
        Part of an unknown collection
      {/if}
    </div>
    <div class="text-3xl font-bold leading-7 mt-1">
      {card.meme.name} #{card.number}
    </div>
    <div>
      Owned by
      <span
        class="text-sky-400 hover:text-sky-300 hover:underline transition-all"
      >
        <UserLink id={card.userId} user={card.user} />
      </span>
    </div>
    <div class="my-4 flex gap-5">
      <div class="flex items-center gap-2">
        <i class="flex fill-white h-5 w-5">
          <Eye />
        </i>
        2.2k views
      </div>
      {#if card.auction?.[0]?.price}
        <div class="flex items-center gap-2">
          <i class="flex fill-white h-5 w-5">
            <MoneyBill />
          </i>
          Auction
        </div>
        <div class="flex items-center gap-2">
          <i class="flex fill-white h-5 w-5">
            <Auction />
          </i>
          15 bids
        </div>
      {/if}
    </div>

    <div
      class="card card-compact shadow-xl bg-base-200 rounded-lg border border-neutral"
    >
      {#if card.auction?.[0]?.price}
        <div
          class="card-body border-b border-neutral flex flex-row items-center"
        >
          <i class="flex fill-white h-7 w-7">
            <Clock />
          </i>
          <div class="text-base font-semibold">
            Sale ends {dateFormatter.format(new Date())}
          </div>
        </div>
      {/if}
      <div class="card-body">
        {#if session?.user?.id === card.userId && card.auction?.[0]?.price}
          <div>Current price</div>
          <div class="text-3xl flex gap-1 items-center font-bold">
            <div class="text-2xl"><Money /></div>
            <div>{card.auction?.[0]?.price}</div>
          </div>
        {:else}
          <div>Sell price</div>
          <div class="text-4xl">
            <form onsubmit={sell}>
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
            </form>
            <div class="label">
              <span class="label-text-alt">
                It will cost you <Money iconClass="-mb-[3px]" />
                {Math.ceil(sellPrice * 0.05)} to put this item up
              </span>
            </div>
          </div>
        {/if}
        <div class="flex gap-3 my-2">
          {#if session?.user?.id === card.userId}
            {#if card.auction?.[0]?.price}
              <button
                class="flex-1 btn btn-active btn-error"
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
                class="flex-1 btn btn-active btn-info"
                onclick={sell}
                disabled={false}
              >
                Sell
              </button>
            {/if}
          {:else if !session?.user?.id}
            <button class="flex-1 btn btn-active btn-primary"
              >Not logged in</button
            >
          {:else if card.auction?.[0]?.price}
            <button
              class="flex-1 btn btn-active btn-primary"
              onclick={() => {
                buyDialog?.showModal();
              }}
              disabled={false}
            >
              Buy now
            </button>
          {:else}
            <button class="flex-1 btn btn-active btn-primary"
              >Card not for sale</button
            >
          {/if}
          <button
            class="flex-1 btn btn-outline"
            onclick={() => {
              window.open(
                `/trade/${crypto?.randomUUID?.() ?? (Math.random() * 9999) | 0}`,
              );
            }}
          >
            Trade
          </button>
        </div>
      </div>
    </div>

    <div class="w-full card card-compact shadow-xl bg-base-200 mt-4">
      <div
        class="collapse collapse-arrow border rounded-lg border border-neutral"
      >
        <input type="checkbox" />
        <div class="collapse-title font-bold flex gap-3 flex items-center">
          <i class="flex w-6 h-6 fill-white scale-95">
            <ChartIcon />
          </i>
          Price history
        </div>
        <div class="collapse-content border-t border-neutral">
          <div class="pt-4">
            <Chart options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{#if card.auction?.[0]?.price}
  <div
    class="h-full flex w-full max-w-[67.50rem] mx-auto justify-center mt-1 mb-5"
  >
    <div class="w-full card card-compact shadow-xl bg-base-200">
      <div class="collapse collapse-arrow border rounded-lg border-neutral">
        <input type="checkbox" />
        <div class="collapse-title font-bold flex gap-3 items-center">
          <i class="flex w-6 h-6 fill-white scale-95">
            <MoreSquare />
          </i>
          {#if randomSuggestions}
            More from multiple collections
          {:else}
            More from this collection
          {/if}
        </div>
        <div class="collapse-content border-t border-neutral">
          <div class="pt-4 flex flex-wrap gap-2 justify-center">
            {#each suggestions as { card }}
              <Card extraClasses="" {card} height={20} />
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

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

<style>
  .sell-price {
    -moz-appearance: textfield;
  }
  .sell-price:is(::-webkit-inner-spin-button, ::-webkit-outer-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
