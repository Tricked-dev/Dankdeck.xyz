<script lang="ts">
  import { getSession } from "auth-astro/server";
  import PartySocket from "partysocket";
  import { onMount } from "svelte";
  import type { Card as CardType } from "@db/schema";
  import Card from "./card/Card.svelte";
  interface Props {
    room: string;
    session: Awaited<ReturnType<typeof getSession>>;
  }
  let { room, session }: Props = $props();

  let sock: PartySocket;

  interface User {}

  let other = $state(undefined);

  let myCardOffer: (CardType | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  let hisCardOffer: (CardType | undefined)[] = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];

  onMount(() => {
    sock = new PartySocket({
      //@ts-ignore -
      host: import.meta.env.DEV
        ? "localhost:1999"
        : "dankdeck.tricked-dev.partykit.dev",
      room: room,
    });

    sock.send(
      JSON.stringify({
        type: "join",
        user: {
          id: session!.user!.id,
          name: session!.user!.name,
          image: session!.user!.image,
        },
      }),
    );

    sock.addEventListener("message", (e) => {
      console.log("Message", e.data);
      let data = JSON.parse(e.data);

      if (data.type == "join" || data.type == "info") {
        other = data.user;
      }

      if (data.type == "join") {
        sock.send(
          JSON.stringify({
            type: "info",
            user: {
              id: session!.user!.id,
              name: session!.user!.name,
              image: session!.user!.image,
            },
          }),
        );
      }
    });
  });
</script>

<div class="flex gap-3 w-full">
  {#each myCardOffer as card}
    {#if card}
      <Card {card} height={25} />
    {:else}
      <div class="h-[25rem] w-[23rem] bg-slate-800 rounded-xl">
        <span>No Card Selected</span>
      </div>
    {/if}
  {/each}
</div>

<hr />
<div class="flex gap-3 w-full">
  {#each hisCardOffer as card}
    {#if card}
      <Card {card} height={25} />
    {:else}
      <div class="h-[25rem] w-[23rem] bg-slate-800 rounded-xl">
        <span>No Card Selected</span>
      </div>
    {/if}
  {/each}
</div>
