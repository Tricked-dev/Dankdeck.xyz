<script lang="ts">
  import type { Card } from "@db/schema.ts";
  interface Props {
    cards: Card[];
  }
  let { cards }: Props = $props();
</script>

<div class="flex w-full p-4 gap-8 max-w-[80rem] mx-auto">
  {#each cards as card}
    <a
      href="/card/{card.id}"
      class="bg-primary-content w-96 h-[30rem] bg-center bg-cover rounded-lg relative"
      style:background-image={`url(${card.meme.img})`}
    >
      <div class="absolute top-0 right-0 text-4xl font-bold p-2 text-white">
        #{card.number}
      </div>
      <div class="absolute bottom-0 left-0 text-2xl font-bold p-2 text-white">
        {card.meme.name}
      </div>
    </a>
  {/each}
</div>
