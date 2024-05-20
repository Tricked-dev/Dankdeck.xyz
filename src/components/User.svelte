<script lang="ts">
  import type { User, Card as CardType } from "@db/schema.ts";
  import Card from "./card/Card.svelte";
  import Money from "./icons/Money.svelte";
  import Avatar from "./Avatar.svelte";
  interface Props {
    user: User & { cardNumber: number };
  }
  let { user }: Props = $props();
</script>

<div
  class="max-w-[70rem] mx-auto my-8 flex flex-row gap-4 bg-base-300 p-4 shadow-lg rounded-2xl w-full"
>
  <Avatar {user} size={9} />
  <div class="mr-auto my-auto flex flex-col gap-3">
    <span class="text-3xl font-bold my-auto">{user.name}</span>
    <span>Joined at: {user.createdAt?.toLocaleDateString("en-UK")}</span>
    <div class="flex gap-3 flex-col md:flex-row">
      <div class="p-2 bg-base-200 rounded-2xl w-32">
        <Money />
        <span>
          {user.balance}
        </span>
      </div>
      <span
        class="p-2 bg-base-200 rounded-2xl w-32 tooltip tooltip-bottom text-left"
        data-tip="Average card number"
      >
        #{user.cardNumber.toFixed(1)}
      </span>
    </div>
  </div>
</div>

<div class="flex flex-wrap justify-center w-full max-w-[70rem] gap-2 mx-auto">
  {#each user.cards as card}
    <Card {card} height={25} price={card.auction?.[0]?.price} hoverEffect />
  {/each}
</div>
