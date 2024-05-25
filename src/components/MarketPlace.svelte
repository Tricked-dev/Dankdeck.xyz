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

<div class="w-full">
  <span
    class="md:text-7xl text-2xl font-extrabold flex p-3 font-serif md:font-bold"
  >
    <span class="mx-auto text-wrap">Card Marketplace</span>
  </span>
  <div class="flex flex-col md:flex-row mx-4 lg:mx-12 justify-center">
    <Filter bind:auctions>
      <Cards class="max-w-[70rem] w-full ml-auto mr-0">
        {#each auctions as auction}
          <Card
            card={auction.card}
            price={auction.price}
            hoverEffect
            height={25}
          />
        {/each}
        {#if !auctions.length}
          <div
            class="text-3xl rounded-lg p-8 bg-neutral text-neutral-content w-full text-center"
          >
            No Results found!
          </div>
        {/if}
      </Cards>
    </Filter>

<!--    <div class="flex flex-col gap-4">-->
<!--      <div class="card card-compact bg-base-300 ">-->
<!--        <div class="card-body flex flex-row items-center gap-4 !text-base">-->
<!--          <button class="btn btn-square bg-base-100">-->
<!--            <BurgerSearch size="1.3rem" />-->
<!--          </button>-->
<!--          <span>{numberFormatter.format(auctions.length)} result{auctions.length > 1 ? 's' : ''}</span>-->
<!--          <label class="input input-bordered flex items-center gap-2 grow">-->
<!--            <input-->
<!--              type="text"-->
<!--              class="grow"-->
<!--              placeholder="Search card by name"-->
<!--              bind:value={search}-->
<!--            />-->
<!--            <SearchIcon />-->
<!--          </label>-->
<!--          <div class="flex items-center">-->
<!--            <Select-->
<!--              clazz="flex items-center gap-3"-->
<!--              selectClass="min-w-[120px]"-->
<!--              roundedClass="rounded-l-lg"-->
<!--              label="Sort by"-->
<!--              options={["price", "number", "date", "random", "name"]}-->
<!--              selected={{-->
<!--                label: 'number',-->
<!--                value: 'number'-->
<!--              }}-->
<!--            />-->

<!--            <Select-->
<!--              selectClass="min-w-[80px]"-->
<!--              roundedClass="rounded-r-lg"-->
<!--              options={["asc", "desc"]}-->
<!--              selected={{-->
<!--                label: 'asc',-->
<!--                value: 'asc'-->
<!--              }}-->
<!--            />-->
<!--          </div>-->
<!--          <button class="btn btn-outline btn-primary min-w-fit">-->
<!--           Reset filters-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="flex">-->
<!--        <div>-->
<!--          <Filter bind:auctions class="hidden md:block" />-->
<!--&lt;!&ndash;          <Filter bind:auctions class="md:hidden p-2" />&ndash;&gt;-->
<!--        </div>-->
<!--        <div>-->
<!--          <Cards class="max-w-[70rem] w-full ml-auto mr-0">-->
<!--            {#each auctions as auction}-->
<!--              <Card-->
<!--                card={auction.card}-->
<!--                price={auction.price}-->
<!--                hoverEffect-->
<!--                height={25}-->
<!--              />-->
<!--            {/each}-->
<!--            {#if !auctions.length}-->
<!--              <div-->
<!--                class="text-3xl rounded-lg p-8 bg-neutral text-neutral-content w-full text-center"-->
<!--              >-->
<!--                No Results found!-->
<!--              </div>-->
<!--            {/if}-->
<!--          </Cards>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div>-->
<!--      <div class="hidden md:block text-xl uppercase font-bold mb-3 leading-none tracking-tight">-->
<!--        Filter cards-->
<!--      </div>-->
<!--      <Filter bind:auctions class="hidden md:block" />-->
<!--    </div>-->
  </div>
</div>
