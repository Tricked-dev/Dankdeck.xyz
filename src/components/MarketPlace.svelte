<script lang="ts">
  import type { Card as CardType, BinAuction } from "@db/schema.ts";
  import Card from "@/components/card/Card.svelte";
  import Cards from "./card/Cards.svelte";
  import { onMount } from "svelte";
  import type { Search } from "@/lib/interfaces";
  import { tr, trpc } from "@/lib/api";
  import Filter from "./Filter.svelte";
  import Select from "@/components/forms/Select.svelte";
  import { BurgerSearch, Search as SearchIcon } from "@/components/icons";
  import Expandable from "@/components/forms/Expandable.svelte";

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
      query: search.length > 0 ? search : undefined,
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

        auctions = res as BinAuction[];
      });
    }, 500);
  });
</script>

<div class="w-full mt-10">
  <div class="flex flex-col md:flex-row mx-4 lg:mx-12 justify-center">
    <Filter bind:auctions>
      <Cards class="w-full ml-auto mr-0">
        {#each auctions as auction}
          <Card
            card={auction.card}
            price={auction.price}
            hoverEffect
            height={25}
          />
        {/each}
        {#if !auctions?.length}
          <div
            class="text-3xl rounded-lg p-8 bg-neutral text-neutral-content w-full text-center"
          >
            No Results found!
          </div>
        {/if}
      </Cards>
    </Filter>
  </div>
</div>
