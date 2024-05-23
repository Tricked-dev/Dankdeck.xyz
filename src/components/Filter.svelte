<script lang="ts">
  import { tr, trpc } from "@/lib/api";
  import type { BinAuction } from "@db/schema";
  import { onMount } from "svelte";
  import type { Search } from "@/lib/interfaces";
  import SearchIcon from "./icons/Search.svelte";
  import type { Writable } from "svelte/store";
  import Range from "./forms/Range.svelte";
  import ComboBox from "./forms/ComboBox.svelte";
  import type { Card } from "@db/schema";

  interface Value {
    value: {
      name: string;
    };
  }

  let origins: any[] = $state([]);
  let parts: any[] = $state([]);

  let max: number | undefined = $state();
  onMount(async () => {
    const data = (await fetch("/api/marketPlaceData.json").then((r) =>
      r.json(),
    )) as {
      top_origins: string[];
      top_parts: string[];
      max_price: number;
    };

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

  let selectedOrigins = $state() as Writable<Value[]>;
  let selectedParts = $state() as Writable<Value[]>;
  let rangeValue = $state() as Writable<[number, number]>;
  let search = $state("");

  let timeout: Timer | number | undefined = undefined;

  interface Props {
    class?: string;
    auctions?: BinAuction[];
    cards?: Card[];
    cardMode?: boolean;
    user?: string;
  }

  let {
    auctions = $bindable(),
    cards = $bindable(),
    class: clazz,
    cardMode,
    user,
  }: Props = $props();

  $effect(() => {
    let arrOrNull = <T,>(arr: T[]): T[] | undefined => {
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
      user,
      cards: cardMode,
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      timeout = undefined;
      await tr(async () => {
        const res = await trpc.binSearch.query(opts);
        if (cardMode) cards = res as Card[];
        else auctions = res as BinAuction[];
      });
    }, 500);
  });
</script>

<div class="mr-auto {clazz}">
  <div class="bg-base-300 rounded-xl mx-auto flex-col p-6 flex gap-8">
    <div class="w-52 md:w-full">
      <label class="input input-bordered flex items-center gap-2">
        <input
          type="text"
          class="grow"
          placeholder="Search Card"
          bind:value={search}
        />
        <SearchIcon />
      </label>
    </div>
    <div>
      <span>Origin</span>
      <ComboBox
        labelContent=""
        options={origins}
        placeholder="Origin"
        bind:selectedItems={selectedOrigins}
      />
    </div>
    <div>
      <span>Part</span>
      <ComboBox
        labelContent=""
        options={parts}
        placeholder="Part"
        bind:selectedItems={selectedParts}
      />
    </div>

    {#if max && !cardMode}
      <div>
        <span>Price {$rangeValue[0]} to {$rangeValue[1]}</span>
        <Range {max} bind:value={rangeValue}></Range>
      </div>
    {/if}
  </div>
</div>
