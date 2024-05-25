<script lang="ts">
  import type { User } from "@db/schema";
  import { signIn, signOut } from "auth-astro/client";
  import { Github, Discord, BigSkull } from "@/components/icons/index";
  import { onMount } from "svelte";
  import { tr, trpc } from "@/lib/api";
  interface Props {
    user: User;
  }
  let { user: usr }: Props = $props();
  let seconds = 15 * 100;
  let user = $state(usr);
  let hoverTimeout = $state(seconds);
  let hovering = $state(false);

  onMount(() => {
    let timeout = setInterval(() => {
      if (!hovering && hoverTimeout < seconds) {
        hoverTimeout += 1;
      }
      if (hovering && hoverTimeout > 0) {
        hoverTimeout += -1;
      } else {
        // hoverTimeout = 0;
      }
    }, 10);
    return () => clearTimeout(timeout);
  });
</script>

<div class="flex gap-1 flex-col min-h-96">
  <div class="flex gap-1 flex-col mb-3">
    <div class="text-lg font-bold leading-5 uppercase">Danger zone</div>
    <div class="text-sm">No one should be in this place ☠️.</div>
  </div>
  <div
    class="flex flex-row flex-1 gap-3 text-center justify-center"
    onmouseenter={() => (hovering = true)}
    onmouseleave={() => (hovering = false)}
    onclick={() =>
      tr(async () => {
        if (hoverTimeout !== 0) return;
        await trpc.deleteAccount.mutate();
        await signOut();
      })}
  >
    <BigSkull />
    {#if hoverTimeout == 0}
      No confirm account delete on skull click
    {:else}
      {(hoverTimeout / 100).toFixed(2)}s
    {/if}
  </div>
</div>
