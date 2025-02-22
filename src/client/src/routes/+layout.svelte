<script lang="ts">
	import { Coins } from 'lucide-svelte';
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-900 text-white">
	<header class="bg-gray-800 p-4 shadow-lg">
		<div class="flex items-center justify-center gap-2">
			<Coins class="h-8 w-8 text-yellow-500" />
			<h1 class="text-2xl font-bold text-yellow-500">ChipMaster.io</h1>
		</div>
	</header>

	<main class="p-4">
		{@render children?.()}
	</main>
</div>
