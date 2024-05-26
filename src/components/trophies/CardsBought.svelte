<script>
  import { PTakingMoney } from "@/components/icons/profile";
  import Tooltip from "@/components/Tooltip.svelte";

  const scales = {
    1: "I",
    2: "II",
    4: "III",
    8: "IV",
    16: "V",
    32: "VI",
    64: "VII",
    128: "VIII",
    256: "IX",
    512: "X",
  }

  export let cardsBought = 0;

  $: scale = Object.entries(scales).reduce((acc, [key, value]) =>
      cardsBought >= parseInt(key) ? value : acc
    , "I");

</script>

<div class="flex items-center flex-col shrink">
  <Tooltip>
    <img slot="text" src={PTakingMoney.src} />
    <div slot="tooltip" class="p-3 max-w-64 -mt-1">
      <div class="text-lg font-semibold">Cards Bought</div>
      <div>This trophy is earned when you buy a card. The more cards you buy, the higher the rank of this trophy.</div>
    </div>
  </Tooltip>
  <div class="font-bold uppercase text-lg font-serif">{scale}</div>
</div>