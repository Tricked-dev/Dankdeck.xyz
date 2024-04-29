<script lang="ts">
    import CodeSnippet from "./CodeSnippet.svelte";

    const {code, filename, desc, rating, comments} = $props();
</script>   


<div class="bg-base-200 flex w-[70rem] h-80 p-4 rounded-xl"> 
    <div class="w-[30rem]">
        <span class="text-3xl font-bold overflow-clip">{filename}</span>
        <br>
        <span class="base-content">{desc}</span>

        <div class="flex py-1">
            [COMMENTS ICON] {comments} <button class="ml-auto btn btn-sm btn-outline">Comment</button>
        </div>
        <div class="flex py-1">
            [RATING ICON] {rating}<span class="text-sm">%</span> <button class="ml-auto btn btn-sm btn-outline">Rate</button>
        </div>
    </div>
    <div class="w-full p-3 rounded-xl">
        <CodeSnippet code={code}></CodeSnippet>

    </div>
</div>