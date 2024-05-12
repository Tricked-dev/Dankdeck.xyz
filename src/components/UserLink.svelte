<script lang="ts">
  import type { User } from "@db/schema";

  interface Props {
    user: {
      id?: string;
      name?: string | null;
    };
    id?: string;
  }
  let { user, id }: Props = $props();
</script>

<a class="link link-hover" href="/user/{id || user.id}">{user.name}</a>
