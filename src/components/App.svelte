<script lang="ts">
  import type { getSession } from "auth-astro/server";
  import CodeSnippet from "./CodeSnippet.svelte";
    import Card from "./Card.svelte";
  let { session }: { session: Awaited<ReturnType<typeof getSession>> } =
    $props();
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">CodeReview</a>
  </div>
  <div class="flex-none gap-2">
    <div class="form-control">
      <input
        type="text"
        placeholder="Search"
        class="input input-bordered w-24 md:w-auto"
      />
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

<!-- <CodeSnippet></CodeSnippet> -->

<div class="mx-auto py-7">
  <Card code="console.log(`Helloo world`)" filename="HelloWorld.js"desc="Please help"  rating="87" comments="9"> </Card>
</div>