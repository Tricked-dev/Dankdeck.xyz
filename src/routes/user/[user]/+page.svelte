<script lang="ts">
    import User from "@/components/User.svelte";
    import type { Card } from "src/types";
    	import type { PageData } from './$types';

	export let data: PageData;
    </script>

  <User user={data.user}  />
