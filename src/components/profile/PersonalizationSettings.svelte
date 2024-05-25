<script lang="ts">
  import type { User, Card as DbCard } from "@db/schema";
  import themes from "themes";
  import { tr, trpc } from "@/lib/api";
  import toast from "svelte-french-toast";
  import { onMount } from "svelte";
  import Select from "@/components/forms/Select.svelte";
  interface Props {
    user: User;
  }
  let { user: usr }: Props = $props();
  let user = $state(usr);
  let theme: string | undefined = $state(user.theme);
  let nsfw: string | undefined = $state(user.nsfw ? "yes" : "no");

  $effect(() => {
    document.documentElement.setAttribute("data-theme", $theme ?? "dark");
  });
</script>

<div class="flex gap-1 flex-col">
  <div class="flex gap-1 flex-col mb-3">
    <div class="text-lg font-bold leading-5 uppercase">Personalization</div>
    <div class="text-sm">Edit how you want the website to look like.</div>
  </div>
  <div class="flex flex-col gap-3">
    <div class="grow">
      <div class="label">
        <div class="font-bold">Theme</div>
      </div>
      <Select
        selectClass="min-w-[80px]"
        roundedClass="!rounded-lg"
        disabled={!theme}
        options={themes}
        defaultSelected={{
          label: theme,
          value: theme,
        }}
        bind:selected={theme}
      />
    </div>
    <div class="grow">
      <div class="label">
        <div class="font-bold">Show NSFW memes</div>
      </div>
      <Select
        selectClass="min-w-[80px]"
        roundedClass="!rounded-lg"
        disabled={!nsfw}
        options={["yes", "no"]}
        defaultSelected={{
          label: nsfw,
          value: nsfw,
        }}
        bind:selected={nsfw}
      />
    </div>
    <button
      class="btn btn-primary btn-outline mt-2"
      onclick={() =>
      tr(async () => {
        await trpc.profileUpdate.mutate({
          name: user.name,
          theme: $theme as typeof themes[number],
          nsfw: $nsfw === "yes",
          showDiscord: user.displayDiscordName,
          showGithub: user.displayGithubName
        });
        toast.success("Personalization settings successfully updated!");
        user.theme = $theme;
        user.nsfw = $nsfw === "yes";
      })}
    >
      Update
    </button>
  </div>
</div>
