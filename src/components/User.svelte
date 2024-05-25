<script lang="ts">
  import type { User, Card as CardType } from "@db/schema.ts";
  import Card from "./card/Card.svelte";
  import Money from "./icons/Money.svelte";
  import Avatar from "./Avatar.svelte";
  import Discord from "./icons/Discord.svelte";
  import Github from "./icons/Github.svelte";
  import { PAvg, PCard, PFee, PHandingMoney, PLens, PTakingMoney, PTrade } from "@/components/icons/profile";
  import Tooltip from "@/components/Tooltip.svelte";
  interface Props {
    user: User & { cardNumber: number };
  }
  let { user }: Props = $props();

  console.log(user);
</script>

<div
  class="max-w-[70rem] mx-auto my-8 flex flex-col bg-base-300 p-5 shadow-lg rounded-2xl w-full"
>
  <div class="flex gap-4">
    <Avatar class="my-auto" {user} size={9} />
    <div class="mr-auto my-auto flex flex-col gap-1">
      <div class="text-2xl font-bold my-auto">{user.name}</div>
      <div class="mb-2 text-sm">Joined at: {user.createdAt?.toLocaleDateString("en-UK")}</div>
      <div class="flex gap-3 flex-col md:flex-row">
        <div class="p-2 bg-base-200 rounded-2xl w-32">
          <Money />
          <span>
          {user.balance}
        </span>
        </div>
        {#if user.discordName}
          <div class="p-2 bg-base-200 rounded-2xl flex flex-1">
            <Discord />
            <span>
            {user.discordName}
          </span>
          </div>
        {/if}
        {#if user.githubName}
          <div class="p-2 bg-base-200 rounded-2xl flex flex-1">
            <Github />
            <a href="https://github.com/{user.githubName}">
              {user.githubName}
            </a>
          </div>
        {/if}
      </div>
    </div>
    <div class="flex gap-3">
      <div class="flex flex-col items-center bg-primary/20 p-5 py-8 rounded-lg flex-1 w-fit min-w-0 max-w-80">
        <img class="w-20 h-20" src={PCard.src} alt="">
        <div class="font-extrabold text-2xl">{user.cards.length}</div>
        <div class="font-semibold text-center">Card{user.cards.length > 1 ? 's' : ''} collected</div>
      </div>
      <div class="flex flex-col items-center bg-primary/20 p-5 py-8 rounded-lg flex-1 w-fit min-w-0 max-w-80">
        <img class="w-20 h-20" src={PTrade.src} alt="">
        <div class="font-extrabold text-2xl">10</div>
        <div class="font-semibold text-center">Trades completed</div>
      </div>
      <div class="flex flex-col items-center bg-primary/20 p-5 py-8 rounded-lg flex-1 w-fit min-w-0 max-w-80">
        <img class="w-20 h-20" src={PLens.src} alt="">
        <div class="font-extrabold text-2xl">10</div>
        <div class="font-semibold text-center">Most viewed card</div>
      </div>
    </div>
  </div>
</div>

<div
  class="max-w-[70rem] mx-auto mb-8 -mt-2 flex flex-col bg-base-300 p-5 shadow-lg rounded-2xl w-full"
>
  <div class="flex gap-1 flex-col mb-3">
    <div class="text-lg font-bold leading-5 uppercase">Trophies</div>
    <div class="text-sm">These are the trophies you earned!</div>
  </div>
  <div class="flex flex-wrap gap-3 shrink p-1 pt-3">
    <div class="flex items-center flex-col shrink">
      <Tooltip>
        <img slot="text" src={PAvg.src} />
        <div slot="tooltip" class="p-3 max-w-64 -mt-1">
          <div class="text-lg font-semibold">Average card number</div>
          <div>This is the average card number calculated from the total cards you have.</div>
        </div>
      </Tooltip>

      <div class="font-bold">  {user.cardNumber.toFixed(1)}</div>
    </div>
    <div class="flex items-center flex-col shrink">
      <Tooltip>
        <img slot="text" src={PFee.src} />
        <div slot="tooltip" class="p-3 max-w-64 -mt-1">
          <div class="text-lg font-semibold">Money earned from selling cards</div>
          <div>This trophie is earmned when you do this and this and that </div>
        </div>
      </Tooltip>
      <div class="font-bold">V</div>
<!--      totalEarnedFromSelling -->
    </div>
    <div class="flex items-center flex-col shrink">
      <Tooltip>
        <img slot="text" src={PHandingMoney.src} />
        <div slot="tooltip" class="p-3 max-w-64 -mt-1">
          <div class="text-lg font-semibold">Money spend </div>
          <div>This trophie is earmned when you do this and this and that </div>
        </div>
      </Tooltip>
      <div class="font-bold">III</div>
    </div>
    <div class="flex items-center flex-col shrink">
      <Tooltip>
        <img slot="text" src={PTakingMoney.src} />
        <div slot="tooltip" class="p-3 max-w-64 -mt-1">
          <div class="text-lg font-semibold">Average card number</div>
          <div>This trophie is earmned when you do this and this and that </div>
        </div>
      </Tooltip>
      <div class="font-bold">I</div>
    </div>
  </div>
  <div class="flex gap-2">

  </div>
</div>

<div class="flex flex-wrap justify-center w-full max-w-[70rem] gap-2 mx-auto">
  {#each user.cards as card}
    <Card {card} height={25} price={card.auction?.[0]?.price} hoverEffect />
  {/each}
</div>
