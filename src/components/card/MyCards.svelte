<script lang="ts">
  import type { Card as CardType } from "@db/schema.ts";
  import r, { setCards } from "@/lib/state.svelte";
  import Card from "@/components/card/Card.svelte";
  import { onMount } from "svelte";
  interface Props {
    cards: CardType[];
  }
  let { cards }: Props = $props();
  let mounted = $state(false);
  onMount(() => {
    setCards(cards);
    mounted = true;
  });
</script>

<div class="flex w-full flex-wrap p-4 gap-8 max-w-[80rem] mx-auto">
  {#if !mounted || !r.cards}
    {#each cards as card}
      <Card {card} height={25} />
    {/each}
  {:else}
    {#each r.cards ?? [] as card}
      <Card {card} height={25} />
    {/each}
  {/if}
</div>
