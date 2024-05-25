<script lang="ts">
  import type { User } from "@db/schema";
  import { signIn } from "auth-astro/client";
  import { Github, Discord } from "@/components/icons/index";
  interface Props {
    user: User;
  }
  let { user: usr }: Props = $props();
  let user = $state(usr);
  let discordLinked = $derived(
    !!user.accounts.find((x) => x.provider == "discord"),
  );
  let githubLinked = $derived(
    !!user.accounts.find((x) => x.provider == "github"),
  );
</script>

<div class="flex gap-1 flex-col">
  <div class="flex gap-1 flex-col mb-3">
    <div class="text-lg font-bold leading-5 uppercase">Account Linking</div>
    <div class="text-sm">Link your account with other social accounts.</div>
  </div>
  <div class="flex flex-col gap-3">
    <div class="text-lg font-bold">Link your accounts to login faster!</div>
    <div class="flex items-center gap-3 ml-2">
      <Discord width="1.8rem" height="1.8rem" />
      <span class="text-lg font-semibold">Discord</span>
      <div
        class="ml-auto md:w-52 md:max-w-[40%] w-full {discordLinked
          ? 'tooltip tooltip-bottom'
          : ''}"
        data-tip="Account already linked"
      >
        <button
          class="btn btn-neutral md:w-52 w-full"
          disabled={discordLinked}
          onclick={() => signIn("discord")}
        >
          {discordLinked ? "Already Connected" : "Connect"}
        </button>
      </div>
    </div>
    <div class="flex items-center gap-3 ml-2">
      <Github width="1.8rem" height="1.8rem" />
      <span class="text-lg font-semibold">Github</span>
      <div
        class="ml-auto md:w-52 md:max-w-[40%] w-full {githubLinked
          ? 'tooltip tooltip-bottom'
          : ''}"
        data-tip="Account already linked"
      >
        <button
          class="btn btn-neutral md:w-52 w-full"
          disabled={githubLinked}
          onclick={() => signIn("github")}
        >
          {githubLinked ? "Already Connected" : "Connect"}
        </button>
      </div>
    </div>
  </div>
</div>
