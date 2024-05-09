<script lang="ts">
  import type { getSession } from "auth-astro/server";
  import { onMount } from "svelte";
  import type { Card as CardType } from "@db/schema";
  import Card from "./card/Card.svelte";
  import Pusher from "pusher-js/worker";
  import type { Channel } from "pusher-js";
  import Modal from "./Modal.svelte";
  import { trpc } from "@/lib/api";
  import toast from "svelte-french-toast";
  interface Props {
    room: string;
    session: Awaited<ReturnType<typeof getSession>>;
  }
  let { room, session }: Props = $props();
  let myCards: CardType[] | undefined = $state(undefined);

  let sock: Pusher;
  let channel: Channel;

  interface UserInfo {
    id: string;
    name: string;
    image: string;
  }

  let other = $state<UserInfo | undefined>(undefined);

  let myCardOffer: (CardType | undefined)[] = $state([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  let hisCardOffer: (CardType | undefined)[] = $state([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  let idx = $state(0);
  let selectModal = $state<HTMLDialogElement | undefined>(undefined);

  onMount(() => {
    // console.log(import.meta.env.PUBLIC_PUSHER_APP_KEY)
    let appKey = import.meta.env.PUBLIC_PUSHER_APP_KEY ?? "";
    sock = new Pusher(appKey, {
      cluster: "eu",
    });
    channel = sock.subscribe(`private-${room}`);

    channel.trigger("client-join", {
      id: session!.user!.id,
      name: session!.user!.name,
      image: session!.user!.image,
    });

    setTimeout(() => {
      channel.trigger("client-join", {
        id: session!.user!.id,
        name: session!.user!.name,
        image: session!.user!.image,
      });
    }, 500);

    const onInfo = (data: UserInfo) => {
      console.log("Info!", data);

      if (data.id !== session!.user!.id) {
        other = data;
      }
    };
    // channel.emit

    channel.bind_global((...props) => {
      console.log(...props);
    });

    channel.bind("client-info", onInfo);
    channel.bind("client-join", (data: UserInfo) => {
      console.log(data);
      console.log("JoiN!");
      channel.trigger("client-info", {
        id: session!.user!.id,
        name: session!.user!.name,
        image: session!.user!.image,
      });
      if (data.id !== session!.user!.id) {
        other = data;
      }
    });

    return () => {
      sock.disconnect();
    };
  });
</script>

{other?.name}
{other?.image}

<div class="flex gap-3 w-full">
  {#each myCardOffer as card, index}
    <div
      class="h-[20rem] w-[17.5rem] bg-slate-800 rounded-xl relative"
      onclick={async (each) => {
          myCards = await trpc.mycards.query() as unknown as CardType[];
          idx = index
          selectModal?.showModal();
        }}
    >
      {#if card}
        <div class="pointer-events-none">
          <Card {card} height={20} />
        </div>
        <button
          class="absolute top-0 left-0 text-4xl font-bold p-2 text-white"
          onclick={(e) => {
            e.stopPropagation();
            myCardOffer[index] = undefined;
          }}>X</button
        >
      {:else}
        <span>No Card Selected</span>
      {/if}
    </div>
  {/each}
</div>

<hr />
<div class="flex gap-3 w-full">
  {#each hisCardOffer as card}
    <div class="h-[20rem] w-[17.5rem] bg-slate-800 rounded-xl">
      {#if card}
        <Card {card} height={25} />
      {:else}
        <span>No Card Selected</span>
      {/if}
    </div>
  {/each}
</div>

<Modal title="Select Card" bind:modal={selectModal} boxClasses="w-[100vw]">
  <div class="flex flex-wrap justify-center w-full max-w-[70rem] gap-2 mx-auto">
    {#each myCards ?? [] as card}
      <div
        class=""
        onclick={() => {
          myCardOffer[idx] = card;
          console.log(myCardOffer);
          selectModal?.close();
          toast.success("Card Selected");
        }}
      >
        <Card
          href="javascript:void"
          extraClasses="pointer-events-none"
          {card}
          height={25}
        />
      </div>
    {/each}
  </div>
</Modal>
