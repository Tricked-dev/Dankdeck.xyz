<script lang="ts">
  import type { getSession } from "auth-astro/server";
  let { session }: { session: Awaited<ReturnType<typeof getSession>> } =
    $props();
</script>

<div class="navbar bg-base-100">
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

<!-- <CodeSnippet></CodeSnippet> -->

<!-- <div class="mx-auto py-7"></div> -->

<div class="w-full">
  <span class="text-7xl flex p-3 font-serif font-bold"
    ><span class="mx-auto">Marketplace</span></span
  >
  <div class="flex flex-wrap w-full max-w-[70rem] gap-2 mx-auto p-2">
    <input class="input input-bordered" placeholder="filter..." />
  </div>
  <div class="flex flex-wrap justify-center w-full max-w-[70rem] gap-2 mx-auto">
    {#each new Array(20) as _, index}
      <div class="bg-base-200 w-64 h-96 rounded-lg relative">
        <div class="absolute top-0 left-0 text-xl font-bold p-2">
          ${(index % 8) + 12}
        </div>
        <div class="absolute top-0 right-0 text-4xl font-bold p-2">
          #{(index % 5) + 1}
        </div>
        <div class="absolute bottom-0 left-0 text-2xl font-bold p-2">
          Huge memes
        </div>
      </div>
    {/each}
  </div>
</div>
