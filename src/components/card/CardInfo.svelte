<script lang="ts">
  import type { BinAuction, Card as CardType } from "@db/schema.ts";
  import type { getSession } from "auth-astro/server";
  import Card from "./Card.svelte";
  import Modal from "@/components/Modal.svelte";
  import toast from "svelte-french-toast";
  import { tr, trpc } from "@/lib/api";
  import { setUserInfo } from "@/lib/state.svelte";
  import UserLink from "../UserLink.svelte";
  import Chart from "@/components/Chart.svelte";
  // prettier-ignore
  import { Money, Eye, Auction, MoneyBill, Clock, TextLine, Details, ChartIcon, MoreSquare } from "@/components/icons";
  import { onMount } from "svelte";
  import Expandable from "../forms/Expandable.svelte";
  import TextTooltip from "@/components/forms/TextTooltip.svelte";
  import Avatar from "@/components/Avatar.svelte";

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

  const ensureDate = (date: Date | string | number | undefined) => {
    if (typeof date == "string" || typeof date == "number") {
      return new Date(date);
    }
    return date;
  };

  const chartOptions = {
    series: [
      {
        name: "Price",
        data: [
          ...card?.auctionEntries.map((x) => [ensureDate(x.soldAt), x.price]),
        ],
      },
    ],
    theme: {
      mode: "dark",
    },
    chart: {
      background: "transparent",
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

  onMount(async () => {
    const selfViewed = parseInt(localStorage.getItem(`v${card.id}`) ?? "0");
    if (selfViewed > 15) return;

    await tr(async () => {
      await trpc.view.mutate({ cardId: card.id });
      card = (await trpc.card.query({
        cardId: card.id,
      })) as unknown as CardType;

      localStorage.setItem(`v${card.id}`, (selfViewed + 1).toString());
    });
  });
</script>

<!--<div class="flex w-full p-4 gap-8 max-w-[80rem] mx-auto">-

TODO: make text better vosible on light backgrounds

-->

{#snippet cardInfoContent()}
  {#if card?.meme.description}
    <Expandable
      title="Description"
      description={card?.meme.description}
      icon={TextLine}
    />
  {/if}
  <Expandable
    title="Description"
    icon={Details}
    iconClass="flex w-6 h-6 fill-current scale-95 ml-2"
  >
    <div class="grid grid-cols-[auto_1fr] items-center">
      {#if card?.meme.year}
        <div class="font-semibold">Year</div>
        <div class="text-right text-sm">{card?.meme.year}</div>
      {/if}
      {#if card?.meme.origin}
        <div class="font-semibold">Origin</div>
        <div class="text-right text-sm">{card?.meme.origin}</div>
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
  </Expandable>
{/snippet}

<div class="h-full w-full p-4 gap-4 max-w-[80rem] mx-auto mt-2 flex-row">
  <div class="flex gap-8 justify-center flex-col md:flex-row">
    <div class="h-full">
      <Card extraClasses="!w-full md:!w-[26.25rem]" {card} height={30} />

      <div
        class="card card-compact shadow-xl bg-base-200 mt-5 w-[26.25rem] hidden md:block"
      >
        {@render cardInfoContent()}
      </div>
    </div>

    <div class="h-full w-full md:w-[50%] flex flex-col gap-2">
      <div
        class="font-bold text-sky-600 uppercase hover:text-sky-300 hover:underline transition-all w-fit"
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
        <TextTooltip
          parentClass="text-sky-400 hover:text-sky-300 hover:underline transition-all inline"
        >
          <span slot="text">
            <UserLink id={card.userId} user={card.user} />
          </span>
          <div
            class="card card-compact shadow-xl bg-base-200 p-5 gap-4"
            slot="tooltip"
          >
            <div class="flex">
              <Avatar class="mr-4" user={card.user} size={3} />
              <div>
                <p class="font-bold">{card.user.name}</p>
                <p class="opacity-75 font-semibold">
                  #{card.user.cardNumber.toFixed(1)}
                </p>
              </div>
            </div>
            <div class="flex gap-4 text-[15px]">
              <div>
                <div class="font-semibold">{card.user.balance}</div>
                <div class="font-bold opacity-65">Balance</div>
              </div>
              <div>
                <div class="font-semibold">{card.user.cardsClaimedCount}</div>
                <div class="font-bold opacity-65">Collected</div>
              </div>
              <div>
                <div class="font-semibold">{card.user.soldCount}</div>
                <div class="font-bold opacity-65">Sold</div>
              </div>
            </div>
            <!--      This one is supposed to have cards, just images no text or anything      -->
            <div class="flex flex-wrap gap-2">
              {#each card.user.cards as c}
                <Card class="w-12 h-12" card={c} height={12} hideTitle={true} />
              {/each}
            </div>
          </div>
        </TextTooltip>
      </div>
      <div class="my-4 flex gap-5">
        <div class="flex items-center gap-2">
          <i class="flex fill-current h-5 w-5">
            <Eye />
          </i>
          {card.views} views
        </div>
        {#if card.auction?.[0]?.price}
          <div class="flex items-center gap-2">
            <i class="flex fill-current h-5 w-5">
              <MoneyBill />
            </i>
            Bin Auction
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
            <i class="flex fill-current h-7 w-7">
              <Clock />
            </i>
            <div class="text-base font-semibold">
              Sale started {dateFormatter.format(
                ensureDate(card.auction?.[0]?.createdAt),
              )}
            </div>
          </div>
        {/if}
        <div class="card-body">
          {#if card.auction?.[0]?.price}
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
              <button class="flex-1 btn btn-active btn-ghost cursor-not-allowed"
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
              <button
                class="flex-1 btn btn-active btn-primary cursor-not-allowed"
              >
                Card not for sale
              </button>
            {/if}
            <button
              class="flex-1 btn btn-outline {!session?.user?.id
                ? 'cursor-not-allowed btn-disabled'
                : ''}"
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
      <div
        class="card card-compact shadow-xl bg-base-200 mt-4 w-full block md:hidden"
      >
        {@render cardInfoContent()}
      </div>

      <div class="w-full card card-compact shadow-xl bg-base-200 mt-4">
        <Expandable
          icon={ChartIcon}
          iconClass="ml-2 flex w-6 h-6 fill-current scale-95"
          title="Price history"
        >
          {#if card?.auctionEntries?.length}
            <Chart options={chartOptions} />
          {:else}
            No price history <span class="italic">yet</span>
          {/if}
        </Expandable>
      </div>
    </div>
  </div>
  {#if card.auction?.[0]?.price}
    <div
      class="h-full flex mx-auto justify-center mt-6 mb-5 max-w-[80rem]"
      style="max-width: calc(28.25rem + 50%)"
    >
      <Expandable
        title={randomSuggestions
          ? "More from multiple collections"
          : "More from this collection"}
        iconClass="flex w-6 h-6 fill-current scale-95 ml-2"
        icon={MoreSquare}
      >
        <div class="flex flex-wrap gap-2 justify-center">
          {#if suggestions.length === 0}
            <div class="h-12">There are no cards in the Marketplace.</div>
          {/if}
          {#each suggestions as { card }}
            <Card extraClasses="" {card} height={20} />
          {/each}
        </div>
      </Expandable>
      <!-- <div class="w-full card card-compact shadow-xl bg-base-200">
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
          <div class="collapse-content border-t border-neutral"></div>
        </div>
      </div> -->
    </div>
  {/if}
</div>

<Modal
  title="Buy {card.meme.name}"
  bind:modal={buyDialog}
  width="max-w-[40rem]"
>
  <!--  <span class="text-1xl">Buy price: <Money /> {card.auction?.[0]?.price}</span>-->
  <!-- tbh not the best i can think of but eh -->
  <div class="flex flex-col items-center mt-4 gap-2">
    <div class="text-lg">Are you sure you want to buy this card?</div>
    <Card {card} height={20} noHref={true} />
    <div class="text-lg font-bold">
      Buy price: <Money />
      {card.auction?.[0]?.price}
    </div>
  </div>

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
