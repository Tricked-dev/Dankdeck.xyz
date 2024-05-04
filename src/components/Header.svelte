<script lang="ts">
  import type { getSession } from "auth-astro/server";
  import { signOut } from "auth-astro/client";
  import Money from "./Money.svelte";
  let { session }: { session: Awaited<ReturnType<typeof getSession>> } =
    $props();
</script>

<div class="navbar bg-base-300">
  <div class="flex-1 flex gap-2">
    <a href="/" class="btn btn-ghost text-xl">Card Thingy</a>
    <a href="/cards" class="btn btn-outline text-xl">My Cards</a>
  </div>

  <div class="flex-none gap-2">
    <div class="p-2 bg-base-200 rounded-2xl w-20">
      <span class="text-primary"><Money /></span> 20
    </div>

    <div class="form-control">
      <button
        class="btn"
        onclick={async () => {
          await fetch("/api/roll");
          window.location.reload();
        }}
      >
        Roll new card
      </button>
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
        <li
          onclick={() => {
            signOut();
            window.location.href = "/login";
          }}
        >
          <a>Logout</a>
        </li>
      </ul>
    </div>
  </div>
</div>
