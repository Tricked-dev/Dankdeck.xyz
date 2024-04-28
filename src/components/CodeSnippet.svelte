<script lang="ts">
  import loader from "@monaco-editor/loader";
  import { onDestroy, onMount } from "svelte";
  import type * as Monaco from "monaco-editor/esm/vs/editor/editor.api";

  let editor: Monaco.editor.IStandaloneCodeEditor;
  let monaco: typeof Monaco;
  let editorContainer: HTMLElement;

  onMount(async () => {
    // Remove this line to load the monaco editor from a CDN
    // see https://www.npmjs.com/package/@monaco-editor/loader#config
    loader.config({ paths: { vs: "/node_modules/monaco-editor/min/vs" } });

    monaco = await loader.init();

    // Sample
    editor = monaco.editor.create(editorContainer, {
      minimap: { enabled: false },
      theme: "vs-dark",
      lineNumbers: "off",
      padding: {
        top: 0,
        bottom: 0,
      },
      scrollbar: {
        vertical: "hidden",
        horizontal: "hidden",
        verticalSliderSize: 0,
        horizontalSliderSize: 0,
        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 0,
      },
      readOnly: true,
      glyphMargin: false,
      lineNumbersMinChars: 0,
    });

    const model = monaco.editor.createModel(
      "console.log('Hello from Monaco! (the editor, not the city...)')",
      undefined,
      // Give monaco a hint which syntax highlighting to use
      monaco.Uri.file("sample.js")
    );
    // model.onDidChangeContent((e) => console.log(e));

    editor.setModel(model);
  });

  onDestroy(() => {
    monaco?.editor.getModels().forEach((model) => model.dispose());
  });
</script>

<div class="h-96" bind:this={editorContainer}></div>

<style>
  :global(.margin-view-overlays div) {
    display: none !important;
  }
</style>
