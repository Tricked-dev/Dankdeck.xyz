<script>
  import { PUnique } from "@/components/icons/profile";
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

  export let uniqueSellers = 0;

  $: scale = Object.entries(scales).reduce((acc, [key, value]) =>
      uniqueSellers >= parseInt(key) ? value : acc
    , "I");

</script>

<div class="flex items-center flex-col shrink">
  <Tooltip>
    <img slot="text" src={PUnique.src} />
    <div slot="tooltip" class="p-3 max-w-64 -mt-1">
      <div class="text-lg font-semibold">Unique Sellers</div>
      <div>This trophy is earned based on the number of different users you've bought cards from. The more unique sellers you buy from, the higher the rank of this trophy.</div>
    </div>
  </Tooltip>
  <div class="font-bold uppercase text-lg font-serif">{scale}</div>
</div>