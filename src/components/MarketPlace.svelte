<div class="w-full">
  <span class="text-7xl flex p-3 font-serif font-bold"
    ><span class="mx-auto">Marketplace</span></span
  >
  <div class="flex flex-wrap w-full max-w-[70rem] gap-2 mx-auto p-2">
    <input class="input input-bordered" placeholder="filter..." />
  </div>
  <div class="flex flex-wrap justify-center w-full max-w-[70rem] gap-2 mx-auto">
    {#each new Array(20) as _, index}
      <a
        href="/card/dd"
        class="bg-base-200 w-64 h-96 rounded-lg relative hover:scale-105 duration-200 shadow-sm hover:shadow-accent hover:z-40"
      >
        <div class="absolute top-0 left-0 text-xl font-bold p-2">
          ${(index % 8) + 12}
        </div>
        <div class="absolute top-0 right-0 text-4xl font-bold p-2">
          #{(index % 5) + 1}
        </div>
        <div class="absolute bottom-0 left-0 text-2xl font-bold p-2">
          Huge memes
        </div>
      </a>
    {/each}
  </div>
</div>
