<script lang="ts">
  import type { Card as CardType } from "@db/schema.ts";
  import r, { setCards } from "@/lib/state.svelte";
  import Card from "@/components/card/Card.svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { tr, trpc } from "@/lib/api";
  import Modal from "../Modal.svelte";
  import Cards from "./Cards.svelte";
  interface Props {
    cards: CardType[];
  }
  let { cards }: Props = $props();
  let mounted = $state(false);

  let onBoardDialog: HTMLDialogElement | undefined = $state();
  let confettiCanvas: HTMLCanvasElement | undefined = $state();

  let obtainedCards: CardType[] = $state([]);
  onMount(() => {
    setCards(cards);
    mounted = true;

    let onboardingUrl =
      new URLSearchParams(window.location.search).get("onboard") == "1";

    if (onboardingUrl || !r.cards?.length) {
      if (onboardingUrl) {
        toast.success("Hello first time user");
      }
      tr(
        async () => {
          const cards = (await trpc.onBoard.mutate())
            .cards as unknown as CardType[];
          setCards([...cards, ...(r.cards ?? [])]);
          obtainedCards = cards;

          onBoardDialog?.showModal();

          window.history.pushState({}, "", "/cards");
          setCards((await trpc.mycards.query()) as unknown as CardType[]);
        },
        () => {
          window.history.pushState({}, "", "/cards");
        },
      );
    }
  });
</script>

<Cards class="max-w-[80rem]">
  {#if !mounted || !r.cards}
    {#each cards as card}
      <Card {card} height={25} />
    {/each}
  {:else}
    {#each r.cards ?? [] as card}
      <Card {card} height={25} />
    {/each}
  {/if}
</Cards>

<Modal
  title="Hello claim your first 5 cards"
  bind:modal={onBoardDialog}
  boxClasses="w-[100vw]"
  backdrop={canvas}
>
  <Cards class="max-w-[70rem]">
    {#each obtainedCards as card}
      <Card extraClasses="" {card} height={25} unbox canvas={confettiCanvas} />
    {/each}
  </Cards>

  <button
    class="btn btn-outline btn-primary"
    onclick={() => {
      onBoardDialog?.close();
    }}>Done</button
  >
</Modal>

{#snippet canvas()}
  <canvas
    bind:this={confettiCanvas}
    class="top-0 left-0 absolute z-50 w-full h-full pointer-events-none"
  ></canvas>
{/snippet}
