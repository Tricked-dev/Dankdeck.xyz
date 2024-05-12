<script lang="ts">
  import type { Card as CardType, BinAuction } from "@db/schema.ts";
  import Card from "@/components/card/Card.svelte";
  import Cards from "./card/Cards.svelte";

  interface Props {
    auctions: BinAuction[];
  }
  let { auctions }: Props = $props();
</script>

<div class="w-full">
  <span class="text-7xl flex p-3 font-serif font-bold"
    ><span class="mx-auto">Marketplace</span></span
  >
  <div class="flex flex-wrap w-full max-w-[70rem] gap-2 mx-auto p-2">
    <input class="input input-bordered" placeholder="filter..." />
  </div>
  <Cards class="max-w-[70rem]">
    {#each auctions as auction}
      <Card card={auction.card} price={auction.price} hoverEffect height={25} />
    {/each}
  </Cards>
</div>
