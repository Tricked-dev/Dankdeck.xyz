<script>
  const card = {
    id: "",
    number: 1,
    last_sold: Date.now(),
    last_sold_for: 20,
    group: "chad",
    name: "GigaChad",
    image:
      "https://i.kym-cdn.com/entries/icons/mobile/000/026/152/gigachadd.jpg",
  };
  const tradeHistory = [
    {
      date: Date.now(),
      type: "sold",
      price: 20,
    },
    {
      date: Date.now(),
      type: "obtained",
    },
  ];
</script>

<div class="flex w-full p-4 gap-8 max-w-[80rem] mx-auto">
  <span class="text-4xl font-bold">
  {card.name}
</span>
</div>
<!--
TODO: make text better vosible on light backgrounds

-->
<div class="h-full flex w-full p-4 gap-8 max-w-[80rem] mx-auto">
  <div class="h-full ">
    <div
      href="/card/dd"
      class="bg-primary-content w-96 h-[30rem] bg-center bg-cover rounded-lg relative"
      style:background-image={`url(${card.image})`}
    >
      <div class="absolute top-0 right-0 text-4xl font-bold p-2 text-white">#1</div>
      <div class="absolute bottom-0 left-0 text-2xl font-bold p-2 text-white">
        {card.name}
      </div>
    </div>
  </div>
  <div class="h-full w-[50%] flex flex-col gap-2">
    <div class="flex gap-2 w-full">
      <button class="btn btn-lg">Sell</button>
      <button class="btn btn-lg">Trade</button>
    </div>

    <div>
      Obtained: {new Date(card.last_sold).toISOString()}<br />
      Last Sold for: ${card.last_sold_for}
    </div>

    <div class="mt-auto">
      <span class="text-2xl font-semibold">Trade History</span>
      <div class="bg-base-300 h-72 rounded-sm p-1">
        {#each tradeHistory as item}
          <div>
            {item.type}
            {new Date(item.date).toISOString()}
            {item.price}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
