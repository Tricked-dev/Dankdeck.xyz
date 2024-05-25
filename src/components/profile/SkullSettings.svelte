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
  let user = $state(usr);
  let hoverTimeout = $state(1500);
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

<div class="flex gap-1 flex-col">
  <div class="flex gap-1 flex-col mb-3">
    <div class="text-lg font-bold leading-5 uppercase">Danger zone</div>
    <div class="text-sm">No one should be in this place ☠️.</div>
  </div>
  <div
    class="flex flex-col gap-3"
    onmouseenter={() => (hovering = true)}
    onmouseleave={() => (hovering = false)}
    onclick={() =>
      tr(async () => {
        await trpc.deleteAccount.mutate();
        await signOut();
      })}
  >
    <BigSkull />
  </div>
</div>
