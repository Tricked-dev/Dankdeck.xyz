<script lang="ts">
  import type { User, Card as DbCard } from "@db/schema";
  import Avatar from "./Avatar.svelte";
  import DateView from "./DateView.svelte";
  import { ProfileIcon, Personalize, Skull, LinkChain } from "./icons/index";
  import GeneralSettings from "@/components/profile/GeneralSettings.svelte";
  import ProfileTabs from "@/components/profile/ProfileTabs.svelte";
  interface Props {
    user: User;
  }
  let { user: usr }: Props = $props();
  let user = $state(usr);
</script>

<div class="flex justify-center max-w-6xl mx-auto w-full mt-10 gap-16 px-4">
  <ProfileTabs user={user} />
</div>