<script>
  import { PBronzePile, PSilverPile, PGoldPile } from "@/components/icons/profile";
  import Tooltip from "@/components/Tooltip.svelte";

  const scales = {
    50: "I",
    100: "II",
    200: "III",
    420: "IV",
    700: "V",
    1000: "VI",
    1500: "VII",
    2000: "VIII",
    2800: "IX",
    4000: "X",
  }

  export let totalSpent = 0;

  $: scale = Object.entries(scales).reduce((acc, [key, value]) =>
      totalSpent >= parseInt(key) ? value : acc
    , "I");

</script>

<div class="flex items-center flex-col shrink">
  <Tooltip>
    <span slot="text" >
      {#if totalSpent < 700}
        <img src={PBronzePile.src} />
      {:else if totalSpent < 2800}
        <img src={PSilverPile.src} />
      {:else}
        <img src={PGoldPile.src} />
      {/if}
    </span>
    <div slot="tooltip" class="p-3 max-w-64 -mt-1">
      <div class="text-lg font-semibold">Total Spent</div>
      <div>This trophy is earned based on the total amount of money you've spent on buying cards. The more money you spend, the higher the rank of this trophy, (upgradable after reaching a certain level).</div>
    </div>
  </Tooltip>
  <div class="font-bold uppercase text-lg font-serif">{scale}</div>
</div>