<script lang="ts">
	import CardMeta from '@/components/card/CardMeta.svelte';
	import MyCards from '@/components/card/MyCards.svelte';
	import type { Card } from 'src/types';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MyCards card={data.cardData} />
