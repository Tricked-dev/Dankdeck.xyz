<script lang="ts">
  import "../app.css";
  import MarketPlace from "@/components/MarketPlace.svelte"
  	import type { PageData } from './$types';
	
	export let data: PageData;


</script>

<MarketPlace auctions={data.auctions}  />
