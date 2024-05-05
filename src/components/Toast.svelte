<!--<script lang="ts">-->
<!--  import AlertInfo from "@/components/icons/AlertInfo.svelte";-->
<!--  import AlertSuccess from "@/components/icons/AlertSuccess.svelte";-->
<!--  import AlertWarning from "@/components/icons/AlertWarning.svelte";-->
<!--  import AlertError from "@/components/icons/AlertError.svelte";-->

<!--  interface Props {-->
<!--    type: 'success' | 'error' | 'warning' | 'info';-->
<!--    direction?: 'top' | 'bottom' | 'left' | 'right';-->
<!--    message: string;-->
<!--    timeout?: number;-->
<!--  }-->

<!--  const { type, message, direction = 'right', timeout = 5000 }: Props = $props();-->
<!--  const icons = {-->
<!--    success: AlertSuccess,-->
<!--    error: AlertError,-->
<!--    warning: AlertWarning,-->
<!--    info: AlertInfo,-->
<!--  };-->
<!--  // as far as I know, tailwind won't detect and add the class to the bundle-->
<!--  // if I did something like {var}-0, so I need to create a map for it-->
<!--  const classDirection = {-->
<!--    top: 'top-0',-->
<!--    bottom: 'bottom-0',-->
<!--    left: 'left-0',-->
<!--    right: 'right-0'-->
<!--  }-->
<!--</script>-->

<!--<div role="alert" class="alert alert-{type} absolute w-96 m-4 {classDirection[direction]}   ">-->
<!--  <svelte:component this={icons[type]} />-->
<!--  <span>{message}</span>-->
<!--</div>-->