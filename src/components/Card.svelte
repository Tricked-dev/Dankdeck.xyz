<script lang="ts">
  import type { Card } from "@db/schema.ts";
  import Money from "./Money.svelte";
  interface Props {
    card: Card;
    height: number;
    price?: number;
    href?: string;
    noHref?: boolean;
    hoverEffect?: boolean;
  }
  let { card, height = 30, price, href, noHref, hoverEffect }: Props = $props();

  let ratio = 14 / 16;

  let width = $derived(height * ratio);

  let classes = $derived(
    hoverEffect
      ? "hover:scale-105 duration-200 shadow-sm hover:shadow-accent hover:z-40"
      : ""
  );
</script>

<a
  href={noHref ? undefined : href ? href : `/card/${card.id}`}
  class="bg-primary-content bg-center bg-cover rounded-lg relative block {classes}"
  style:background-image={`url(${card.meme.img})`}
  style:view-transition-name={card.id}
  style:height={`${height}rem`}
  style:width={`${width}rem`}
>
  {#if price != undefined}
    <div class="absolute top-0 left-0 text-xl font-bold p-2">
      <Money />
      {price}
    </div>
  {/if}
  <div class="absolute top-0 right-0 text-4xl font-bold p-2 text-white">
    #{card.number}
  </div>
  <div
    class="absolute bottom-0 left-0 text-2xl font-bold p-2 text-white bg-slate-700 bg-opacity-45"
  >
    {card.meme.name}
  </div>
</a>
