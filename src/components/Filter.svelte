<script lang="ts">
  import { tr, trpc } from "@/lib/api";
  import { onMount } from "svelte";
  import type { BinAuction, Card } from "@db/schema";
  import type { Search } from "@/lib/interfaces";
  import type { Readable, Writable } from "svelte/store";
  import SearchIcon from "./icons/Search.svelte";
  import Range from "./forms/Range.svelte";
  import ComboBox from "./forms/ComboBox.svelte";
  import { BurgerSearch } from "@/components/icons";
  import Select from "@/components/forms/Select.svelte";

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

  let showAdvancedFilters = $state(true);
  let selectedOrigins = $state() as Readable<Value[]>;
  let selectedParts = $state() as Readable<Value[]>;
  let rangeValue = $state() as Readable<[number, number]>;
  let search = $state("");
  let year = $state();
  let sort: Readable<string> | undefined = $state();
  let order: Readable<string> | undefined = $state();
  let toggled = $state(false);

  let timeout: Timer | number | undefined = undefined;

  interface Props {
    class?: string;
    auctions?: BinAuction[];
    cards?: Card[];
    cardMode?: boolean;
    user?: string;
    children?: any;
  }

  let {
    auctions = $bindable(),
    cards = $bindable(),
    class: clazz,
    cardMode,
    children,
    user,
  }: Props = $props();

  $effect(() => {
    let arrOrNull = <T,>(arr: T[]): T[] | undefined => {
      if (arr?.length) return arr;
    };
    if (!rangeValue && !cardMode) return;
    const opts: Search = {
      year: parseInt(year ?? 0),
      query: search.length > 0 ? search : undefined,
      origin: arrOrNull($selectedOrigins?.map((x) => x.value.name)),
      partOf: arrOrNull($selectedParts?.map((x) => x.value.name)),
      priceRange: {
        min: cardMode ? 0 : $rangeValue[0],
        max: cardMode ? 0 : $rangeValue[1],
      },
      sellingOnly: toggled,
      user,
      sort: $sort,
      order: $order,
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

  const numberFormatter = Intl.NumberFormat(undefined);

  function resetFilters() {
    window.location.reload();
  }
</script>

<div class="flex flex-col gap-4">
  <div class="card card-compact bg-base-300">
    <div class="card-body flex flex-row items-center gap-4 !text-base">
      <button
        class="btn btn-square bg-base-100"
        onclick={() => (showAdvancedFilters = !showAdvancedFilters)}
      >
        <BurgerSearch filled={!showAdvancedFilters} size="1.3rem" />
      </button>
      <span class="hidden lg:block"
        >{numberFormatter.format(auctions?.length)} result{auctions?.length > 1
          ? "s"
          : ""}</span
      >
      <label class="input input-bordered flex items-center gap-2 grow">
        <input
          type="text"
          class="grow"
          placeholder="Search card by name"
          bind:value={search}
        />
        <SearchIcon />
      </label>
      <div class="items-center hidden lg:flex">
        {@render orderS()}
      </div>
      <button
        class="hidden lg:block btn btn-outline btn-primary min-w-fit"
        onclick={resetFilters}
      >
        Reset filters
      </button>
    </div>
    <div
      class="card-body flex flex-row items-center gap-2 !text-base lg:hidden !pt-0"
    >
      <div class="hidden sm:block">
        {numberFormatter.format(auctions?.length)} result{auctions?.length > 1
          ? "s"
          : ""}
      </div>
      <div class="flex items-center grow justify-center">
        {@render orderS()}
      </div>
      <button
        class="hidden sm:block btn btn-outline btn-primary min-w-fit grow max-w-72"
        onclick={resetFilters}
      >
        Reset filters
      </button>
    </div>
    <div
      class="card-body flex-row items-center gap-2 !text-base !pt-0 block sm:hidden"
    >
      <div class="n">
        {numberFormatter.format(auctions?.length)} result{auctions?.length > 1
          ? "s"
          : ""}
      </div>
      <button
        class="btn btn-outline btn-primary min-w-fit grow max-w-72 ml-auto"
        onclick={resetFilters}
      >
        Reset filters
      </button>
    </div>
  </div>
  <div class="flex">
    {#if showAdvancedFilters}
      <div class="hidden lg:block">
        {@render filter()}
      </div>
    {/if}
    <div>
      {@render children()}
    </div>
  </div>
</div>

{#snippet orderS()}
  <Select
    clazz="flex items-center gap-2"
    selectClass="min-w-[120px]"
    roundedClass="rounded-l-lg"
    label="Sort by"
    options={[
      ...(cardMode ? [] : ["price"]),
      "number",
      "date",
      "random",
      "name",
    ]}
    selected={{
      label: "number",
      value: "number",
    }}
  />

  <Select
    selectClass="min-w-[80px]"
    roundedClass="rounded-r-lg"
    options={["asc", "desc"]}
    selected={{
      label: "asc",
      value: "asc",
    }}
  />
{/snippet}

{#snippet filter()}
  <div class="mr-auto {clazz}">
    <div class="bg-base-300 rounded-xl mx-auto flex-col p-6 flex gap-4 w-72">
      <div class="flex flex-col gap-2">
        <div class="font-bold">Filter by username</div>
        <label class="input input-bordered flex items-center gap-2">
          <input
            type="text"
            class="grow"
            placeholder="Type a username"
            bind:value={search}
          />
        </label>
      </div>
      <div class="flex flex-col gap-2">
        <div class="font-bold">Filter by year collection</div>
        <label class="input input-bordered flex items-center gap-2">
          <input
            type="number"
            min="0"
            class="grow"
            placeholder="Type a year"
            bind:value={year}
          />
        </label>
      </div>
      <div class="flex flex-col gap-2">
        <div class="font-bold">Filter by origin</div>
        <ComboBox
          labelContent=""
          options={origins}
          placeholder="Type an origin: Youtube ..."
          bind:selectedItems={selectedOrigins}
        />
      </div>
      <div class="flex flex-col gap-2">
        <div class="font-bold">Filter by part</div>
        <ComboBox
          labelContent=""
          options={parts}
          placeholder="Part"
          bind:selectedItems={selectedParts}
        />
      </div>
      {#if max && !cardMode}
        <div class="flex flex-col gap-2">
          <div class="font-bold">Price range</div>
          <div>
            <span>From {$rangeValue[0]} to {$rangeValue[1]}</span>
            <Range {max} bind:value={rangeValue}></Range>
          </div>
        </div>
      {/if}
      {#if cardMode}
        <div class="flex flex-col gap-2">
          <div class="font-bold">Selling only</div>
          <input type="checkbox" class="toggle" bind:checked={toggled} />
        </div>
      {/if}
    </div>
  </div>
{/snippet}

<!--&lt;!&ndash;    <div>&ndash;&gt;-->
<!--&lt;!&ndash;      <span>Sort By</span>&ndash;&gt;-->
<!--&lt;!&ndash;      <select class="select select-bordered mx-2" bind:value={sort}>&ndash;&gt;-->
<!--&lt;!&ndash;        {#each ["price", "number", "date", "random", "name"] as n}&ndash;&gt;-->
<!--&lt;!&ndash;          {#if !(cardMode && n === "price")}&ndash;&gt;-->
<!--&lt;!&ndash;            <option value={n}>{n}</option>&ndash;&gt;-->
<!--&lt;!&ndash;          {/if}&ndash;&gt;-->
<!--&lt;!&ndash;        {/each}&ndash;&gt;-->
<!--&lt;!&ndash;      </select>&ndash;&gt;-->
<!--&lt;!&ndash;      <select class="select select-bordered" bind:value={order}>&ndash;&gt;-->
<!--&lt;!&ndash;        {#each ["asc", "desc"] as n}&ndash;&gt;-->
<!--&lt;!&ndash;          <option value={n}>{n}</option>&ndash;&gt;-->
<!--&lt;!&ndash;        {/each}&ndash;&gt;-->
<!--&lt;!&ndash;      </select>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->

<!--    {#if max && !cardMode}-->
<!--      <div>-->
<!--        <span>Price {$rangeValue[0]} to {$rangeValue[1]}</span>-->
<!--        <Range {max} bind:value={rangeValue}></Range>-->
<!--      </div>-->
<!--    {/if}-->
<!--    {#if cardMode}-->
<!--      <div>-->
<!--        <span>Selling only</span>-->
<!--        <input type="checkbox" class="toggle" bind:checked={toggled} />-->
<!--      </div>-->
<!--    {/if}-->
<!--  </div>-->
<!--</div>-->
