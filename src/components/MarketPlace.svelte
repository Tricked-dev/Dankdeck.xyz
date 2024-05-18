<script lang="ts">
  import type { Card as CardType, BinAuction } from "@db/schema.ts";
  import Card from "@/components/card/Card.svelte";
  import Cards from "./card/Cards.svelte";
  import ComboBox from "./forms/ComboBox.svelte";
  import { onMount } from "svelte";
  import type { Search } from "@/lib/interfaces";
  import { tr, trpc } from "@/lib/api";
  import Range from "./forms/Range.svelte";

  interface Props {
    auctions: BinAuction[];
  }
  let { auctions: auc }: Props = $props();
  let auctions: BinAuction[] = $state(auc);

  let origins = $state([]);
  let parts = $state([]);

  let max: number | undefined = $state();
  onMount(async () => {
    const data = await fetch("/api/marketPlaceData.json").then((r) => r.json());

    origins = data.top_origins.map((x) => ({
      name: x,
      disabled: false,
    }));

    parts = data.top_parts.map((x) => ({
      name: x,
      disabled: false,
    }));

    console.log(max);

    max = data.max_price;
  });

  let selectedOrigins = $state();
  let selectedParts = $state();
  let rangeValue = $state(0);
  let search = $state("");

  let updating = false;

  let timeout: Timer | number | undefined = undefined;

  $effect(() => {
    let arrOrNull = (arr) => {
      if (arr?.length) return arr;
    };
    if (!rangeValue) return;
    const opts: Search = {
      origin: arrOrNull($selectedOrigins?.map((x) => x.value.name)),
      partOf: arrOrNull($selectedParts?.map((x) => x.value.name)),
      priceRange: {
        min: $rangeValue[0],
        max: $rangeValue[1],
      },
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      timeout = undefined;
      await tr(async () => {
        const res = await trpc.binSearch.query(opts);
        console.log(res);

        auctions = res as BinAuction[];
      });
    }, 500);
  });
</script>

<div class="w-full">
  <ComboBox
    labelContent=""
    options={origins}
    placeholder="Origin"
    bind:selectedItems={selectedOrigins}
  ></ComboBox>
  <ComboBox
    labelContent=""
    options={parts}
    placeholder="Part"
    bind:selectedItems={selectedParts}
  ></ComboBox>
  {#if max}
    <Range {max} bind:value={rangeValue}></Range>
  {/if}
  <span class="text-7xl flex p-3 font-serif font-bold"
    ><span class="mx-auto">Marketplace</span></span
  >
  <div class="flex flex-wrap w-full max-w-[70rem] gap-2 mx-auto p-2">
    <input
      class="input input-bordered"
      placeholder="filter..."
      bind:value={search}
    />
  </div>
  <Cards class="max-w-[70rem]">
    {#each auctions as auction}
      <Card card={auction.card} price={auction.price} hoverEffect height={25} />
    {/each}
  </Cards>
</div>
