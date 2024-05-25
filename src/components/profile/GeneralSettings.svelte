<script lang="ts">
  import { tr, trpc } from "@/lib/api.js";
  import type { Card as DbCard, User } from "@db/schema.js";
  import toast from "svelte-french-toast";
  import Avatar from "@/components/Avatar.svelte";
  import Modal from "@/components/Modal.svelte";
  import Cards from "@/components/card/Cards.svelte";
  import Card from "@/components/card/Card.svelte";
  import Select from "@/components/forms/Select.svelte";
  import { Details } from "@/components/icons";
  import themes from "../../../themes.ts";
  import { type Writable } from "svelte/store";

  interface Props {
    user: User;
  }
  let { user: usr }: Props = $props();
  let user = $state(usr);
  let nameInput: HTMLInputElement | undefined = $state();

  let showDiscord: Writable<string> | undefined = $state();
  let showGithub: Writable<string> | undefined = $state();

  let discordLinked = $derived(
    !!user.accounts.find((x) => x.provider == "discord"),
  );
  let githubLinked = $derived(
    !!user.accounts.find((x) => x.provider == "github"),
  );

  let cards = $state<DbCard[]>([]);
  let selectModal: HTMLDialogElement | undefined = $state();

  let defaultShowDiscord = user.displayDiscordName ? "yes" : "no";
  let defaultShowGithub = user.displayGithubName ? "yes" : "no";
</script>

<div class="flex gap-1 flex-col">
  <div class="flex gap-1 flex-col mb-3">
    <div class="text-lg font-bold leading-5 uppercase">GENERAL INFO</div>
    <div class="text-sm">Edit your account's general information</div>
  </div>
  <div class="flex flex-col justify-center">
    <div
      class="flex gap-1 items-center justify-center text-lg uppercase6 font-semibold"
    >
      <span>Profile image</span>
      <span
        class="tooltip"
        data-tip="This allows you to change your avatar to any card you have, just click on the picture and select one."
      >
        <div class="flex w-6 h-6 fill-current scale-75 mt-1">
          <Details />
        </div>
      </span>
    </div>
    <div class="flex mx-auto">
      <button
        onclick={() => {
          tr(async () => {
            cards = await trpc.mycards.query() as unknown as DbCard[];
            selectModal?.showModal();
          });
        }}
      >
        <!--          Intended border flashing, you might not like it, if I forgor to mention it on discord remind me-->
        <Avatar
          {user}
          size={12}
          class="mx-auto border-2 border-transparent p-1 hover:border-dashed hover:border-gray-500 transition-all"
        />
      </button>
    </div>
  </div>
  <div class="flex flex-col gap-3">
    <label class="form-control w-full">
      <div class="label pt-0">
        <div class="font-bold">Username</div>
      </div>
      <input
        type="email"
        class="input input-bordered flex items-center gap-2"
        placeholder="Username"
        bind:this={nameInput}
        value={user.name}
      />
    </label>
    <label class="form-control w-full">
      <div class="label pt-0">
        <div class="font-bold">Email</div>
      </div>
      <input
        type="email"
        class="input input-bordered flex items-center gap-2"
        placeholder="Email"
        value={user.email}
        readonly
      />
    </label>
    <div class="flex gap-2 md:flex-row w-full">
      <div class="grow">
        <div class="label">
          <div class="font-bold">Show Discord Name</div>
        </div>
        <Select
          selectClass="min-w-[80px]"
          roundedClass="!rounded-lg"
          disabled={!discordLinked}
          options={["yes", "no"]}
          bind:selected={showDiscord}
          defaultSelected={{
            label: defaultShowDiscord,
            value: defaultShowDiscord,
          }}
        />
      </div>
      <div class="grow">
        <div class="label">
          <div class="font-bold">Show Github Name</div>
        </div>
        <Select
          selectClass="min-w-[80px]"
          roundedClass="!rounded-lg"
          disabled={!githubLinked}
          options={["yes", "no"]}
          bind:selected={showGithub}
          defaultSelected={{
            label: defaultShowGithub,
            value: defaultShowGithub,
          }}
        />
      </div>
    </div>
    <button
      class="btn btn-primary btn-outline mt-2"
      onclick={() =>
      tr(async () => {
        await trpc.profileUpdate.mutate({
          name: nameInput!.value,
          theme: user.theme ?? themes[0],
          nsfw: user.nsfw ?? 'no',
          showDiscord: $showDiscord === "yes",
          showGithub: $showGithub === "yes",
        });

        toast.success("General information successfully updated!");
        // user.name = nameInput!.value;
        // user.displayDiscordName = $showDiscord === "yes";
        // user.displayGithubName = $showGithub === "yes"
      })}
    >
      Update
    </button>
  </div>
</div>

<Modal title="Select Picture" bind:modal={selectModal} boxClasses="w-[100vw]">
  <Cards class="max-w-[70rem]">
    {#each cards ?? [] as card}
      <div
        class=""
        onclick={() =>
          tr(async () => {
            await trpc.picture.mutate({
              memeId: card.meme.id,
            });
            selectModal?.close();
            user.picture = `https://r2.dankdeck.xyz/${card.meme.shortId}.png`;
            toast.success("Profile picture updated");
          })}
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
