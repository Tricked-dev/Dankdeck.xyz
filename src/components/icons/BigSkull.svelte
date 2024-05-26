<script>
  import { onMount } from "svelte";

  onMount(() => {
    const icon = document.querySelector(".maki--danger");
    const svgWidth = icon.getBoundingClientRect().width;
    const svgHeight = icon.getBoundingClientRect().height;

    const div = document.querySelector(".boxie");
    div.style.width = `${svgWidth}px`;
    div.style.height = `${svgHeight}px`;
  });
</script>

<div class="relative">
  <div class="icon-wrapper absolute z-10">
    <i class="maki--danger"></i>
  </div>
  <div class="absolute">
    <div class="boxie flex w-fit"></div>
  </div>
</div>

<style>
  .maki--danger {
    stroke: red;
    transform: translate(-56%, 0);
    margin: 30px 50px 50px;
    display: inline-block;
    width: 240px;
    height: 240px;
    --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 15 15'%3E%3Cpath fill='%23000' d='M13.94 14.68a.5.5 0 0 1-.47.32c-.06.01-.12.01-.18 0L7.5 12.56L1.7 15a.5.5 0 0 1-.648-.284l-.002-.006a.5.5 0 0 1 .29-.71l4.85-2l-4.85-2a.5.5 0 1 1 .36-.93l5.8 2.41l5.8-2.41a.5.5 0 1 1 .36.93L8.8 12l4.85 2a.5.5 0 0 1 .29.68M12 4.23v.45a1 1 0 0 1-.2.59A17.718 17.718 0 0 1 10 7v1.16a.5.5 0 0 1-.32.47l-2.16.87h-.07l-2.17-.87A.5.5 0 0 1 5 8.16V7a17.563 17.563 0 0 1-1.82-1.73A1 1 0 0 1 3 4.68v-.45A4.6 4.6 0 0 1 7.11 0h.75A4.59 4.59 0 0 1 12 4.23M6 4a1 1 0 1 0-2 0a1 1 0 0 0 2 0m1 3a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 1 0zm2 0a.5.5 0 0 0-1 0v.5a.5.5 0 0 0 1 0zm2-3a1 1 0 1 0-2 0a1 1 0 0 0 2 0'/%3E%3C/svg%3E");
    background-color: currentColor;
    -webkit-mask-image: var(--svg);
    mask-image: var(--svg);
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    stroke-dasharray: 10;
    stroke-dashoffset: 10;
    transition: stroke-dashoffset 15s linear;
  }

  .maki--danger:hover {
      stroke-dashoffset: 0;
  }

  .boxie {
    position: absolute;
    padding: 50px;
    box-sizing: content-box;
    border-radius: 50%;
    transition: 15s ease-in-out;
    opacity: 0;
    filter: blur(10px);
    left: -133px;
  }

  .icon-wrapper:hover ~ div > .boxie {
    opacity: 1;
  }
</style>
