<script lang="ts">
    import Trade from "@/components/Trade.svelte";
    import type { PageData } from './$types';

	export let data: PageData;
    </script>

  <Trade session={data.session} room={data.room}  />
