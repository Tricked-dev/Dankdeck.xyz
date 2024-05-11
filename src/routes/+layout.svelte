<script lang="ts">
    import Header from "@/components/Header.svelte";
    import "../app.css";
     import { page } from "$app/stores"
    </script>

    <svelte:head>

    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <title>DankDeck</title>

    <!-- {
      !host.includes("localhost") && (

      )
    } -->
     <script
          data-goatcounter="https://stats.dankdeck.xyz/count"
          async
          src="//stats.dankdeck.xyz/count.js"
        />
    <slot name="head" />
</svelte:head>
<Header session={$page.data.session} />
    <!-- class="w-screen min-h-screen flex flex-col"
    transition:animate={fade({ duration: "0.1s" })}
  > -->
    <!-- <Header client:idle session={session} /> -->
    <slot />