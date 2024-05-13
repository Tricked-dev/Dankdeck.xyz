<script lang="ts">
  import type { User } from "@db/schema";

  interface Props {
    user:
      | {
          picture?: string;
          image?: string;
        }
      | undefined
      | Partial<User>;
    image?: string;
    size?: number;
    class?: string;
  }

  let { user, image, size = 6, class: clazz }: Props = $props();
</script>

<img
  src={image ?? user?.picture ?? user?.image}
  alt="avatar"
  class="rounded-full avatar object-cover {clazz}"
  style="height: {size}rem; width: {size}rem;"
/>
