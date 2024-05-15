<script lang="ts">
  import type { User, Card as DbCard } from "@db/schema";
  import Avatar from "./Avatar.svelte";
  import DateView from "./DateView.svelte";
  import themes from "themes";
  import { tr, trpc } from "@/lib/api";
  import toast from "svelte-french-toast";
  import { signIn, signOut } from "auth-astro/client";
  import Github from "./icons/Github.svelte";
  import Discord from "./icons/Discord.svelte";
  import Cards from "./card/Cards.svelte";
  import Modal from "./Modal.svelte";
  import Card from "./card/Card.svelte";
  import { onMount } from "svelte";
  import { navigate } from "astro/virtual-modules/transitions-router.js";
  interface Props {
    user: User;
  }
  let { user: usr }: Props = $props();
  let user = $state(usr);
  let nameInput: HTMLInputElement | undefined = $state();
  let theme: string | undefined = $state(user.theme);

  let nsfw: string | undefined = $state(user.nsfw ? "yes" : "no");

  $effect(() => {
    document.documentElement.setAttribute("data-theme", theme ?? "dark");
  });

  let discordLinked = $derived(
    !!user.accounts.find((x) => x.provider == "discord"),
  );
  let githubLinked = $derived(
    !!user.accounts.find((x) => x.provider == "github"),
  );

  let cards = $state<DbCard[]>([]);
  let selectModal: HTMLDialogElement | undefined = $state();
  let hoverTimeout = $state(1500);
  // let hoverTimeout = $state(0);
  let hovering = $state(false);

  onMount(() => {
    let timeout = setInterval(() => {
      if (hovering && hoverTimeout > 0) {
        hoverTimeout += -1;
      } else {
        // hoverTimeout = 0;
      }
    }, 10);
    return () => clearTimeout(timeout);
  });
</script>

<div
  class="max-w-[70rem] mx-auto w-full text-3xl font-bold mt-8 mb-2 p-2 md:p-0"
>
  Profile
</div>

<div
  class="bg-base-300 rounded-xl mx-auto flex flex-col p-4 gap-4 max-w-[70rem] w-full"
>
  <div class="flex flex-col justify-center">
    <span class="text-2xl font-semibold text-center">{user.name}</span>
    <span class="text-sm font-semibold text-center mb-2">Thats you</span>
    <div class="flex mx-auto">
      <button
        onclick={() => {
        tr(async () => {
          cards = await trpc.mycards.query() as unknown as DbCard[];
          selectModal?.showModal();
        });
      }}
      >
        <Avatar {user} size={15} class="mx-auto" />
      </button>
    </div>

    <span class="text-center mt-2">
      Joined at:
      <DateView date={user.createdAt}></DateView>
    </span>
  </div>
  <div class="flex gap-2 flex-col">
    <span class="text-xl font-semibold leading-5 mt-4">GENERAL INFO</span>
    <span>Change your display name</span>
    <div class="flex gap-2 flex-col md:flex-row w-full">
      <label
        class="input input-bordered flex items-center gap-2 text-primary w-full"
      >
        Email
        <input
          type="email"
          class="grow text-base-content"
          placeholder="Email"
          value={user.email}
          readonly
        />
      </label>
      <label
        class="input input-bordered flex items-center gap-2 text-primary w-full"
      >
        Name
        <input
          type="text"
          class="grow text-base-content"
          placeholder="Name"
          bind:this={nameInput}
          value={user.name}
        />
      </label>
    </div>
    <span class="text-xl font-semibold leading-5 mt-4">PERSONALIZATION</span>
    <span>Change your preferences</span>
    <div class="flex gap-2 flex-col md:flex-row w-full">
      <label
        class="input input-bordered flex items-center gap-2 text-primary w-full"
      >
        Theme
        <select class="grow select text-base-content" bind:value={theme}>
          {#each themes as theme}
            <option value={theme}>{theme}</option>
          {/each}
        </select>
      </label>
      <label
        class="input input-bordered flex items-center gap-2 text-primary w-full"
      >
        NSFW Memes Enabled
        <select class="grow select text-base-content" bind:value={nsfw}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>
    </div>

    <button
      class="btn btn-primary btn-outline"
      onclick={() =>
        tr(async () => {
          await trpc.profileUpdate.mutate({
            name: nameInput!.value,
            theme: theme as typeof themes[number],
            nsfw: nsfw === "yes",
          });
          toast.success("Information successfully updated!");
        })}
      >Update</button
    >

    <span class="text-3xl font-semibold leading-5 mt-4">Account Linking</span>
    <span>Link other accounts</span>
    <div class="flex gap-2 flex-col md:flex-row w-full">
      <div
        class="md:w-52 md:max-w-[40%] w-full {discordLinked
          ? 'tooltip tooltip-bottom'
          : ''}"
        data-tip="Account already linked"
      >
        <button
          class="btn btn-neutral md:w-52 w-full"
          disabled={discordLinked}
          onclick={() => signIn("discord")}><Discord />Discord</button
        >
      </div>
      <div
        class="md:w-52 md:max-w-[40%] w-full {githubLinked
          ? 'tooltip tooltip-bottom'
          : ''}"
        data-tip="Account already linked"
      >
        <button
          class="btn btn-neutral md:w-52 w-full"
          disabled={githubLinked}
          onclick={() => signIn("github")}
        >
          <Github />
          Github
        </button>
      </div>
    </div>
    <span class="text-3xl font-semibold leading-5 mt-4">Red Light District</span
    >
    <details class="collapse bg-base-200">
      <summary class="collapse-title text-xl font-medium"
        >You will regret this!!</summary
      >
      <div class="collapse-content">
        <button
          onmouseenter={() => (hovering = true)}
          onmouseleave={() => (hovering = false)}
          class="btn btn-error"
          onclick={() =>
            tr(async () => {
              if (hoverTimeout != 0) {
                return toast.error(
                  "Please wait " +
                    (hoverTimeout / 100).toFixed(2) +
                    "s before deleting your account, we aren't quite sure if you want to do this yet",
                );
              }
              toast.success("Goodbye comrade");
              await trpc.deleteAccount.mutate();
              await signOut();
              navigate("/");
            })}
        >
          Delete Account {#if hoverTimeout}{(hoverTimeout / 100).toFixed(
              2,
            )}s{/if}
        </button>
      </div>
    </details>
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
