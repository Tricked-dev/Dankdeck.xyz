<script lang="ts">
  import type { getSession } from "auth-astro/server";
  import { onMount } from "svelte";
  import type { Card as CardType, User as DbUser } from "@db/schema";
  import Card from "./card/Card.svelte";
  import type Pusher from "pusher-js";
  import type { Channel, PresenceChannel } from "pusher-js";
  import Modal from "./Modal.svelte";
  import { tr, trpc } from "@/lib/api";
  import toast from "svelte-french-toast";
  import Cards from "./card/Cards.svelte";
  import { navigate } from "astro:transitions/client";
  import Cross from "./icons/Cross.svelte";
  interface Props {
    room: string;
    session: { user: DbUser };
  }
  let { room, session }: Props = $props();
  let myCards: CardType[] | undefined = $state(undefined);

  let sock: Pusher;
  let channel: Channel;
  let presenceChannel: PresenceChannel;

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
  let myCardOfferIds = $derived(myCardOffer.map((x) => x?.id));
  let hisCardOffer: (CardType | undefined)[] = $state([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);

  let idx = $state(0);
  let selectModal = $state<HTMLDialogElement | undefined>(undefined);
  let doubleConnectModal = $state<HTMLDialogElement | undefined>(undefined);

  let meAgreed = $state(false);
  let heAgreed = $state(false);

  let me = {
    id: session!.user!.id,
    name: session!.user!.name,
    image: session!.user!.picture,
  };

  onMount(async () => {
    const { default: Pusher } = await import("pusher-js");
    // console.log(import.meta.env.PUBLIC_PUSHER_APP_KEY)
    let appKey = import.meta.env.PUBLIC_PUSHER_APP_KEY ?? "";
    sock = new Pusher(appKey, {
      cluster: import.meta.env.PUBLIC_PUSHER_APP_CLUSTER!,
    });
    channel = sock.subscribe(`private-${room}`);

    channel.trigger("client-join", me);

    setTimeout(() => {
      channel.trigger("client-join", me);
    }, 500);

    const onInfo = (data: UserInfo) => {
      console.log("Info!", data);

      if (data.id !== session!.user!.id) {
        other = data;
      }
    };
    // channel.emit

    channel.bind("client-info", onInfo);
    channel.bind("client-join", (data: UserInfo) => {
      console.log(data);
      console.log("JoiN!");
      channel.trigger("client-info", {
        id: session!.user!.id,
        name: session!.user!.name,
        image: session!.user!.picture,
      });
      if (data.id !== session!.user!.id) {
        other = data;
      } else {
        doubleConnectModal?.showModal();
        other = undefined;
        sock.disconnect();
      }
      if (myCardOffer.filter((x) => x).length != 0)
        channel.trigger("client-select", { cards: myCardOffer, me });
    });
    channel.bind(
      "client-select",
      (data: { cards: (CardType | undefined)[]; me: UserInfo }) => {
        hisCardOffer = data.cards;
        other = data.me;
        if (meAgreed) {
          channel.trigger("client-agree", {
            agreed: false,
          });
          meAgreed = false;
        }
      },
    );

    channel.bind("client-agree", async (agreed: { agreed: boolean }) => {
      console.log("HeAgreed!");
      heAgreed = agreed.agreed;

      if (meAgreed) {
        await tr(async () => {
          const { id } = await trpc.createOffer.mutate({
            offeredCards: myCardOfferIds.filter((c) => c) as string[],
            receivedCards: hisCardOffer
              .map((x) => x?.id)
              .filter((c) => c) as string[],
            user: other!.id,
          });
          channel.trigger("client-offer", id);
        });
      }
    });

    channel.bind("client-offer", async (offerId: string) => {
      const offer = await tr(async () => {
        return await trpc.getOffer.query({
          id: offerId,
        });
      });

      if (!offer) return;

      if (offer.offeredCards.length != hisCardOffer.filter((c) => c).length) {
        console.log("Offer Received is not complete. Please try again", 1);
        toast.error("Offer Received is not complete. Please try again");
        return;
      }
      if (offer.receivedCards.length != myCardOffer.filter((c) => c).length) {
        console.log("Offer Received is not complete. Please try again", 2);
        toast.error("Offer Received is not complete. Please try again");
        return;
      }
      if (offer.offerer.id !== other?.id) {
        console.log("Offer Received is not complete. Please try again", 3);
        toast.error("Offer Received is not complete. Please try again");
        return;
      }
      if (offer.receiver.id !== session?.user?.id) {
        console.log("Offer Received is not complete. Please try again", 4);
        toast.error("Offer Received is not complete. Please try again");
        return;
      }

      await trpc.acceptOffer.mutate({
        offerId: offerId,
      });
      console.log("Received Offer", offer);

      toast.success("Trade Complete!");

      channel.trigger("client-trade-completed", {
        id: offerId,
      });
      reset();
    });

    channel.bind("client-trade-completed", (_data: unknown) => {
      toast.success("Trade Complete!");
      reset();
    });

    // return () => {
    //   sock.disconnect();
    // };
  });

  function reset() {
    for (let i = 0; i < myCardOffer.length; i++) {
      myCardOffer[i] = undefined;
    }
    for (let i = 0; i < hisCardOffer.length; i++) {
      hisCardOffer[i] = undefined;
    }
    heAgreed = false;
    meAgreed = false;
  }

  onMount(() => {
    return () => {
      sock.disconnect();
    };
  });

  function setAgreed(agreed: boolean) {
    meAgreed = agreed;
    channel.trigger("client-agree", {
      agreed,
    });
  }
</script>

{#snippet CardView(card, click, click2)}
  <div
    class="h-[20rem] w-[17.5rem] bg-slate-800 rounded-xl relative mb-5"
    onclick={click}
  >
    {#if card}
      <div class="pointer-events-none">
        <Card {card} height={20} />
      </div>
      {#if click2}
        <button
          class="absolute bottom-[-25px] w-full text-[20px] font-bold p-2 text-white bg-error text-center rounded-b-xl flex justify-center"
          onclick={click2}
        >
          <span class="mx-auto">
            <Cross />
          </span>
        </button>
      {/if}
    {:else}
      <span
        class="flex justify-center text-center h-full text-3xl font-semibold {click2
          ? `hover:text-primary cursor-pointer duration-200`
          : ``}"><span class="my-auto">No Card Selected</span></span
      >
    {/if}
  </div>
{/snippet}
<div class="mx-auto flex flex-col gap-2">
  <span class="text-2xl font-semibold my-2">Dank Deck Trading</span>

  <Cards class="">
    {#each myCardOffer as card, index}
      {@render CardView(card,
        async () => {
          tr(async() => {
            myCards = await trpc.mycards.query() as unknown as CardType[];
            idx = index
            selectModal?.showModal();
          })
        },
        (e:MouseEvent) => {
            e.stopPropagation();
            myCardOffer[index] = undefined;
            channel.trigger("client-select", {cards:myCardOffer,me});
          }
        )}
    {/each}
  </Cards>

  <div class="max-w-full w-full my-2 font-bold">
    {#if other}
      <div class="text-2xl flex gap-3">
        <img src={other?.image} alt={other?.name} class="rounded-full w-16" />
        <span class="my-auto">
          {other?.name}
          {#if heAgreed}<span class="text-green-700 text-xl">(Accepted)</span>
          {:else}<span class="text-red-700 text-xl">(Not Accepted)</span>{/if}
          <span class="text-sm"><br /> Is offering: </span>
        </span>
        {#if meAgreed}
          <button
            class="ml-auto btn btn-error"
            onclick={() => {
              setAgreed(false);
            }}>Cancel Accept</button
          >
        {:else if heAgreed}
          <button
            class="ml-auto btn btn-success"
            onclick={() => setAgreed(true)}>Confirm Trade</button
          >
        {:else}
          <button
            class="ml-auto btn btn-success"
            onclick={() => setAgreed(true)}>Confirm</button
          >
        {/if}
      </div>
    {:else}
      Waiting for other person..

      <button
        class="btn-xs btn-primary btn"
        onclick={() => {
          const path = window.location.pathname;
          navigator.clipboard.writeText(`${window.origin}/login?r=${path}`);
        }}>Copy Link</button
      >
    {/if}
  </div>
  <Cards class="">
    {#each hisCardOffer as card}
      {@render CardView(card, undefined, undefined)}
    {/each}
  </Cards>
</div>

<Modal title="Select Card" bind:modal={selectModal} boxClasses="w-[100vw]">
  <Cards class="max-w-[70rem]">
    {#each myCards?.filter((c) => !myCardOfferIds.includes(c.id)) ?? [] as card}
      <div
        class=""
        onclick={() => {
          myCardOffer[idx] = card;
          console.log(myCardOffer);
          selectModal?.close();
          toast.success("Card Selected");
          channel.trigger("client-select", { cards: myCardOffer, me });
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
  </Cards>
</Modal>

<Modal
  title="You are already connected to this trade on another device"
  bind:modal={doubleConnectModal}
>
  <div class="flex gap-3">
    <button class="btn btn-primary" onclick={() => navigate("/")}>Ok</button>
  </div>
</Modal>
