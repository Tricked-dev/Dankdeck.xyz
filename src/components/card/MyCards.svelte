<script lang="ts">
  import type { Card as CardType } from "@db/schema.ts";
  import r, { setCards } from "@/lib/state.svelte";
  import Card from "@/components/card/Card.svelte";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { tr, trpc } from "@/lib/api";
  interface Props {
    cards: CardType[];
  }
  let { cards }: Props = $props();
  let mounted = $state(false);
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
          const cards = (await trpc.onBoard.mutate()) as unknown as CardType[];

          await setCards([...cards, ...(r.cards ?? [])]);

          window.history.pushState({}, "", "/cards");
        },
        () => {
          window.history.pushState({}, "", "/cards");
        },
      );
    }
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
