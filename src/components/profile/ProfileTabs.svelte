<script lang="ts">
  import { createTabs, melt } from '@melt-ui/svelte';
  import { LinkChain, Personalize, ProfileIcon, Skull } from "@/components/icons";
  import DateView from "@/components/DateView.svelte";
  import GeneralSettings from "@/components/profile/GeneralSettings.svelte";
  import Avatar from "@/components/Avatar.svelte";
  import PersonalizationSettings from "@/components/profile/PersonalizationSettings.svelte";
  import LinkedSocialsSettings from "@/components/profile/LinkedSocialsSettings.svelte";
  import SkullSettings from "@/components/profile/SkullSettings.svelte";
  import type { User } from "@db/schema.ts";

  const {
    elements: { root, list, content, trigger },
    states: { value },
  } = createTabs({
    defaultValue: 'tab-1',
  });

  export let user: User;

  const triggers = [
    { id: 'tab-1', title: 'General', icon: ProfileIcon },
    { id: 'tab-2', title: 'Personalization', icon: Personalize },
    { id: 'tab-3', title: 'Link socials', icon: LinkChain },
    { id: 'tab-4', title: 'Red light district', icon: Skull },
  ];
</script>

<div
  use:melt={$root}
  class="flex gap-7 grow"
>
  <div class="flex flex-col gap-5 max-w-80 grow">
    <div class="flex items-center gap-3">
      <Avatar class="" {user} size={4}/>

      <div>
        <div class="font-bold text-lg">{user.name}</div>
        Joined at <DateView date={user.createdAt}></DateView>
      </div>
    </div>
    <div
      use:melt={$list}
      class="flex flex-col gap-2"
    >
      {#each triggers as triggerItem}
        <div
          use:melt={$trigger(triggerItem.id)}
          class="font-semibold text-lg text-muted-400 hover:text-info-content/75
          hover:bg-primary cursor-pointer flex items-center gap-2 rounded-lg p-3 transition-colors duration-300
          {$value === triggerItem.id ? 'text-primary bg-primary/20' : ''}
        ">
          <svelte:component this={triggerItem.icon} />
          <span>{triggerItem.title}</span>
        </div>
      {/each}
    </div>
  </div>
  <div class="grow">
    <div use:melt={$content('tab-1')} class="bg-base-300 rounded-xl mx-auto flex-col p-5 max-w-[70rem] w-full {$value === 'tab-1' ? 'flex' : ''}">
      <GeneralSettings {user} />
    </div>
    <div use:melt={$content('tab-2')} class="bg-base-300 rounded-xl mx-auto flex-col p-5 max-w-[70rem] w-full {$value === 'tab-2' ? 'flex' : ''}">
      <PersonalizationSettings {user} />
    </div>
    <div use:melt={$content('tab-3')} class="bg-base-300 rounded-xl mx-auto flex-col p-5 max-w-[70rem] w-full {$value === 'tab-3' ? 'flex' : ''}">
      <LinkedSocialsSettings {user} />
    </div>
    <div use:melt={$content('tab-4')} class="bg-base-300 rounded-xl mx-auto flex-col p-5 max-w-[70rem] w-full {$value === 'tab-4' ? 'flex' : ''}">
      <SkullSettings {user} />
    </div>
  </div>
</div>


