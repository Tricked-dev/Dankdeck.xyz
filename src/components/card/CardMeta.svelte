<script lang="ts">
  import type { Card } from "@db/schema.ts";
  interface Props {
    card: Card;
  }
  let { card }: Props = $props();
</script>

<meta property="og:description" content={card.meme.description} />
<meta property="og:image" content={`/card/${card.id}.png`} />
<meta property="og:title" content={card.meme.name} />
<meta name="twitter:description" content={card.meme.description} />
<meta name="twitter:image" content={`/card/${card.id}.png`} />
<meta name="twitter:title" content={card.meme.name} />
<meta
  name="description"
  content="Card #{card.number} featuring {card.meme.name}. {card.auction?.[0]
    ?.price
    ? `Selling for for ${card.auction?.[0]?.price}`
    : ''}"
/>
<meta
  name="keywords"
  content="{card.meme.name}, {card.meme
    .slug}, trading cards, auctions, collectibles"
/>
<meta property="og:author" content={card.user.name} />
<meta property="og:author:image" content={card.user.picture} />
<meta
  property="og:author:url"
  content={`https://dankdeck.xyz/user/${card.userId}`}
/>
<link
  rel="alternate"
  type="application/json+oembed"
  href="https://dankdeck.xyz/card/{card.id}/oembed.json"
  title="Bacon Lollys oEmbed Profile"
/>
