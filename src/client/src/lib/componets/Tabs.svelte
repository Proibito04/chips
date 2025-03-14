<script lang="ts">
	import { onMount } from 'svelte';

  interface Tab{
		label: string;
		content: any;
		props?: Record<string, any>;
	}

	export let tabs: Array<Tab>;

	let activeTab = 0;

	onMount(() => {
		// remember the last chosen tab
		let lastTab = localStorage.getItem('lastTab');
		if (lastTab) {
			tabs.forEach((tab, index) => {
				if (tab.label === lastTab) {
					activeTab = index;
				}
			});
		}
	});

  function choseTab(tab: Tab, index: number) {
    activeTab = index;
    localStorage.setItem('lastTab', tab.label);
  }
</script>

<div class="w-full">
	<div class="flex border-b border-gray-700">
		{#each tabs as tab, index}
			<button
				onclick={() => choseTab(tab, index)}
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
