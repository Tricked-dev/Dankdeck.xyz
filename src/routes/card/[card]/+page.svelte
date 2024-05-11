<script lang="ts">
    import CardMeta from "@/components/card/CardMeta.svelte";
    import CardInfo from "@/components/card/CardInfo.svelte";
    import type { Card } from "src/types";
    	import type { PageData } from './$types';

	export let data: PageData;
    </script>

<CardMeta card={data.cardData} />

<CardInfo card={data.cardData} />
