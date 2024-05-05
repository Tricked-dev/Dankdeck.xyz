<script lang="ts">
  import type { Card } from "@db/schema.ts";
  import Money from "@/components/icons/Money.svelte";
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
      : "",
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
    <div class="absolute top-0 left-0 text-xl font-bold p-1">
      <span class="text-cyan-800 bg-slate-50/20 p-1 rounded-xl">
        <Money />
        {price}
      </span>
    </div>
  {/if}
  <div
    class="absolute top-0 right-0 text-4xl font-bold p-2 text-white"
    style:text-shadow="1px 1px 4px rgba(0, 0, 0, 0.5)"
  >
    #{card.number}
  </div>
  <div
    class="absolute bottom-0 left-0 text-2xl font-bold p-2 text-white bg-slate-700 bg-opacity-45"
  >
    {card.meme.name}
  </div>
</a>
