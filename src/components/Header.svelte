<script lang="ts">
  import type { getSession } from "auth-astro/server";
  let { session }: { session: Awaited<ReturnType<typeof getSession>> } =
    $props();
</script>

<div class="navbar bg-base-300">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">Card Thingy</a>
  </div>
  <div class="flex-none gap-2">
    <div class="p-2 bg-base-200 rounded-2xl w-20">
      <span class="text-primary">$</span> 20
    </div>

    <div class="form-control">
      <button class="btn"> Roll new card </button>
    </div>

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img alt="Tailwind CSS Navbar component" src={session?.user?.image} />
        </div>
      </div>
      <ul
        tabindex="0"
        class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <a class="justify-between">
            Profile
            <span class="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
