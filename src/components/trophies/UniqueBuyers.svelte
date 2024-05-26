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

  export let uniqueBuyers = 0;

  $: scale = Object.entries(scales).reduce((acc, [key, value]) =>
      uniqueBuyers >= parseInt(key) ? value : acc
    , "I");

</script>

<div class="flex items-center flex-col shrink">
  <Tooltip>
    <img slot="text" src={PUnique.src} />
    <div slot="tooltip" class="p-3 max-w-64 -mt-1">
      <div class="text-lg font-semibold">Unique Buyers</div>
      <div>his trophy is earned based on the number of different users you've sold cards to. The more unique buyers you sell to, the higher the rank of this trophy.</div>
    </div>
  </Tooltip>
  <div class="font-bold uppercase text-lg font-serif">{scale}</div>
</div>