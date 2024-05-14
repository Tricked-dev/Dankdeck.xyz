<!--https://www.reddit.com/r/sveltejs/comments/n508th/apex_chart_with_sveltekit/-->
<script lang="ts">
  import { onMount } from 'svelte';
  import type ApexTypes from "apexcharts/types/apexcharts";

  export let options: ApexTypes.ApexOptions;

  // options.

  let ApexCharts: ApexTypes.ApexCharts;
  let loaded = false;

  const chart = (node, options) => {

    if (!loaded)
      return

    let myChart = new ApexCharts(node, options)
    myChart.render()

    return {
      update(options) {
        myChart.updateOptions(options)
      },
      destroy() {
        myChart.destroy()
      }
    }
  }

  onMount(async () => {
    const module = await import('apexcharts');
    ApexCharts = module.default;
    window.ApexCharts = ApexCharts
    loaded = true
  });

</script>

{#if loaded}
  <div use:chart={options}></div>
{/if}