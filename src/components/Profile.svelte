<script lang="ts">
  import type { User } from "@db/schema";
  import Avatar from "./Avatar.svelte";
  import DateView from "./DateView.svelte";
  import themes from "themes";
  import { tr, trpc } from "@/lib/api";
  import toast from "svelte-french-toast";
  import { signIn } from "auth-astro/client";
  import Github from "./icons/Github.svelte";
  import Discord from "./icons/Discord.svelte";
  interface Props {
    user: User;
  }
  let { user }: Props = $props();

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
    <Avatar {user} size={15} class="mx-auto" />
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
  </div>
</div>
