<script>
  import { PFee } from "@/components/icons/profile";
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

  export let totalEarnings = 0;

  $: scale = Object.entries(scales).reduce((acc, [key, value]) =>
      totalEarnings >= parseInt(key) ? value : acc
    , "I");

</script>

<div class="flex items-center flex-col shrink">
  <Tooltip>
    <img slot="text" src={PFee.src} />
    <div slot="tooltip" class="p-3 max-w-64 -mt-1">
      <div class="text-lg font-semibold">Total Earnings</div>
      <div>This trophy is earned based on the total amount of money you've earned from selling cards. The more money you earn, the higher the rank of this trophy.</div>
    </div>
  </Tooltip>
  <div class="font-bold uppercase text-lg font-serif">{scale}</div>
</div>