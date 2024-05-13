<script lang="ts">
  import type { User } from "@db/schema";
  import type { User as AuthUser } from "@auth/core/types";

  interface Props {
    user?:
      | {
          picture?: string;
          image?: string;
        }
      | undefined
      | Partial<User>
      | User
      | AuthUser;
    image?: string;
    size?: number;
    class?: string;
  }

  let { user, image, size = 6, class: clazz }: Props = $props();
  let usr = $state(user as User);
</script>

<img
  src={image ?? usr?.picture ?? usr?.image}
  alt="avatar"
  class="rounded-full avatar object-cover {clazz}"
  style="height: {size}rem; width: {size}rem;"
/>
