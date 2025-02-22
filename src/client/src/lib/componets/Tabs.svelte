<script lang="ts">
	export let tabs: Array<{
		label: string;
		content: any;
		props?: Record<string, any>;
	}>;

	let activeTab = 0;
</script>

<div class="w-full">
	<div class="flex border-b border-gray-700">
		{#each tabs as tab, index}
			<button
				on:click={() => (activeTab = index)}
				class="px-4 py-2 text-sm font-medium transition-colors {activeTab === index
					? 'border-b-2 border-yellow-500 text-yellow-500'
					: 'text-gray-400 hover:text-gray-300'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="py-4">
		{#if tabs[activeTab]} 
			<svelte:component this={tabs[activeTab].content} {...tabs[activeTab].props} />
		{/if}
	</div>
</div>
