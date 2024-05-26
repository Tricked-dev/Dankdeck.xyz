<script>
  import { PCardsClaimed } from "@/components/icons/profile";
  import Tooltip from "@/components/Tooltip.svelte";

  const scales = {
    1: "I",
    3: "II",
    10: "III",
    30: "IV",
    80: "V",
    150: "VI",
    250: "VII",
    450: "VIII",
    700: "IX",
    1000: "X",
  }

  export let cardsClaimed = 0;

  $: scale = Object.entries(scales).reduce((acc, [key, value]) =>
      cardsClaimed >= parseInt(key) ? value : acc
    , "I");

</script>

<div class="flex items-center flex-col shrink">
  <Tooltip>
    <img slot="text" src={PCardsClaimed.src} />
    <div slot="tooltip" class="p-3 max-w-64 -mt-1">
      <div class="text-lg font-semibold">Cards Claimed</div>
      <div>This trophy is earned when you claim a card. The more cards you claim, the higher the rank of this trophy. </div>
    </div>
  </Tooltip>
  <div class="font-bold uppercase text-lg font-serif">{scale}</div>
</div>