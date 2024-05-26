<script lang="ts">
  import Money from "@/components/icons/Money.svelte";
  import type { ApplicationCard } from "@/lib/interfaces";
  import { doConfetti } from "@/lib/utils";
  interface Props {
    card: ApplicationCard;
    height: number;
    price?: number;
    href?: string;
    noHref?: boolean;
    hoverEffect?: boolean;
    extraClasses?: string;
    unbox?: boolean;
    canvas?: HTMLCanvasElement;
    hideTitle?: boolean
  }
  let {
    card,
    height = 30,
    price,
    href,
    noHref,
    hoverEffect,
    extraClasses,
    unbox,
    canvas,
    hideTitle = false
  }: Props = $props();

  let ratio = 14 / 16;

  let width = $derived(height * ratio);

  let classes = $derived(
    hoverEffect
      ? "hover:scale-105 duration-200 shadow-sm hover:shadow-accent hover:z-40"
      : "",
  );
  let bg = $derived(
    `image-set("https://r2.dankdeck.xyz/${card?.meme?.shortId}.avif" type("image/avif"),"https://r2.dankdeck.xyz/${card?.meme?.shortId}.png" type("image/png"));`,
  );
  let open = $state(false);
  let shouldOpen = $derived(!unbox || open);
</script>

<!-- style:background-image={bg}
  style:height={`${height}rem`}
  style:width={`${width}rem`}
  style:--bg={bg} -->
<!-- style:view-transition-name={card.id} -->

<a
  href={noHref ? undefined : href ? href : `/card/${card.id}`}
  class="card bg-center rounded-lg relative block {shouldOpen
    ? 'flipped'
    : 'cursor-pointer'} {classes} {extraClasses}"
  style="height: {height}rem; width: {width}rem;min-height: {height}rem; min-width: {width}rem;"
  onclick={(e) => {
    if (unbox && !open) {
      e.preventDefault();
      doConfetti(
        undefined,
        [
          { p: 150, s: 360, a: 0, v: 25 + Math.random() * 5 },
          { p: 110, s: 360, a: 0, v: 40 + Math.random() * 10 },
          { p: 150, s: 360, a: 0, v: 35 + Math.random() * 6 },
          { p: 300, s: 360, a: 0, v: 30 + Math.random() * 20 },
        ],
        canvas,
      );
    }
    open = true;
  }}
>
  <div class="card-inner w-full h-full relative">
    <div
      class="card-front rounded-lg text-4xl text-center flex justify-center align-middle items-center"
    >
      <span> Open new card </span>
    </div>

    <div class="card-back rounded-lg overflow-hidden">
      {#if !hideTitle}
        <div
          class="bg-neutral text-neutral-content flex justify-between gap-3 items-center text-lg px-4 font-semibold max-h-36 p-2"
        >
          <div>#{card.number}</div>
          <div>{card.meme.name}</div>
        </div>
      {/if}

      <div
        class="bg-primary-content bg-cover bg-center absolute w-full h-full"
        style="background-image: {bg};"
      >
      </div>
      {#if price != undefined}
        <div class="absolute bottom-1 left-0 text-xl font-bold p-1">
          <span
            class="text-white bg-slate-50/20 p-1 rounded-xl"
            style:text-shadow="1px 1px 4px rgba(0, 0, 0, 0.5)"
          >
            <Money />
            {price}
          </span>
        </div>
      {/if}
    </div>
  </div>
</a>

<style>
  .card {
    perspective: 1000px;
  }
  .card-inner {
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotateY(0deg);
  }

  .card.flipped .card-inner {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
  }

  .card-front {
    background-color: black;
  }

  .card-back {
    transform: rotateY(180deg);
  }
</style>
