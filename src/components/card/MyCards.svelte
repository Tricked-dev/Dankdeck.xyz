<script lang="ts">
  import type { Card as CardType } from "@db/schema.ts";
  import Card from "@/components/card/Card.svelte";
  interface Props {
    cards: CardType[];
  }
  let { cards }: Props = $props();
</script>

<div class="flex w-full flex-wrap p-4 gap-8 max-w-[80rem] mx-auto">
  {#each cards as card}
    <Card {card} height={25} />
  {/each}
</div>
