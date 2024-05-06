<script lang="ts">
  import type { User, Card as CardType } from "@db/schema.ts";
  import Card from "./card/Card.svelte";
  import Money from "./icons/Money.svelte";
  interface Props {
    user: User;
  }
  let { user }: Props = $props();
</script>

<div class="max-w-[70rem] mx-auto my-8 flex flex-row gap-4">
  <img src={user.image} class="avatar rounded-full h-36 ml-0" alt="avatar" />
  <div class="mr-auto my-auto flex flex-col">
    <span class="text-3xl font-bold my-auto">{user.name}</span>
    <span>Joined at: {user.createdAt?.toLocaleDateString("en-UK")}</span>
    <div class="p-2 bg-base-200 rounded-2xl w-20">
      <Money />
      <span>
        {user.balance}
      </span>
    </div>
  </div>
</div>

<div class="flex flex-wrap justify-center w-full max-w-[70rem] gap-2 mx-auto">
  {#each user.cards as card}
    <Card {card} height={25} price={card.auction?.[0]?.price} hoverEffect />
  {/each}
</div>
