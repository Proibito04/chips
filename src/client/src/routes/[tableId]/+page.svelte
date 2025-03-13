<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gameStore } from '$lib/stores/game';
	import type { PageProps } from './$types';
	import Tabs from '$lib/componets/Tabs.svelte';
	import TableView from '$lib/view/TableView.svelte';
	import GameView from '$lib/view/GameView.svelte';
	import { ArrowDownCircle, Coins } from 'lucide-svelte';
	import BetSystem from '$lib/componets/BetSystem.svelte';
	import Withdraw from '$lib/componets/Withdraw.svelte';

	let { data }: PageProps = $props();
	let isBetting = $state(false);
	let isWithdrawModalOpen = $state(false);
	let usernamePromiseResolve: (value: string | PromiseLike<string>) => void;
	let showUsernamePopup = $state(true);
	let inputUsername = $state('');

	function saveUsername() {
		if (inputUsername.trim()) {
			localStorage.setItem('username', inputUsername);
			usernamePromiseResolve(inputUsername);
			showUsernamePopup = false;
		}
	}

	function createPromise(): Promise<string> {
		return new Promise<string>((resolve) => {
			usernamePromiseResolve = resolve;
		});
	}

	onMount(async () => {
		let username = localStorage.getItem('username');

		if (!username) {
			showUsernamePopup = true;
			await createPromise();
			username = localStorage.getItem('username');
		}

		gameStore.connect(data.tableId, username || '');
	});

	onDestroy(() => {
		gameStore.disconnect();
	});

	const tabs = [
		{
			label: 'Game',
			content: GameView
		},
		{
			label: 'Table',
			content: TableView
		}
	];
</script>

{#if showUsernamePopup}
	<div
		class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-95"
	>
		<div class="flex w-80 flex-col rounded-lg border-2 border-yellow-500 bg-gray-800 p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-bold text-white">Choose a username</h2>
			<input
				type="text"
				bind:value={inputUsername}
				placeholder="Enter your username"
				onkeydown={(e) => e.key === 'Enter' && saveUsername()}
				class="mb-4 rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-yellow-500 focus:outline-none"
			/>
			<button
				onclick={saveUsername}
				class="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 shadow-lg transition-all hover:bg-yellow-400 active:scale-95 active:transform"
			>
				Continue
			</button>
		</div>
	</div>
{/if}

{#if $gameStore.connected}
	<div class="min-h-screen bg-gray-900 pb-20">
		<!-- Tabs Section -->
		<div class="px-4">
			<Tabs {tabs} />
		</div>

		<!-- Bottom Fixed Section -->
		<div class="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg">
			{#if isBetting}
				<BetSystem
					pot={$gameStore.pot}
					playerChips={$gameStore.players[localStorage.getItem('username') || ''].chips}
					close={() => {
						isBetting = false;
					}}
				/>
			{/if}
			<div class="mx-auto max-w-md p-4">
				<div class="flex items-center justify-between">
					<!-- Current Pot Display -->
					<div class="flex items-center space-x-2">
						<div class="rounded-lg bg-gray-700 p-3">
							<Coins class="h-6 w-6 text-yellow-500" />
						</div>
						<div>
							<div class="text-sm text-gray-400">Current Pot</div>
							<div class="text-xl font-bold text-yellow-500">
								{$gameStore.pot.toLocaleString()}
							</div>
						</div>
					</div>

					<!-- Bet Button -->
					<button
						onclick={() => (isWithdrawModalOpen = true)}
						class="rounded-lg border-2 border-yellow-500 px-4 py-3 font-semibold text-yellow-500 transition-all hover:bg-yellow-500 hover:text-gray-900"
					>
						<ArrowDownCircle class="h-5 w-5" />
					</button>
					<button
						onclick={() => (isBetting = !isBetting)}
						class="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 shadow-lg transition-all hover:bg-yellow-400 active:scale-95 active:transform"
					>
						Place Bet
					</button>
				</div>
			</div>
		</div>

		{#if isWithdrawModalOpen}
			<Withdraw onClose={() => (isWithdrawModalOpen = false)} maxAmount={$gameStore.pot} />
		{/if}
	</div>
{:else}
	<div class="flex h-screen items-center justify-center bg-gray-900">
		<div class="animate-pulse text-lg text-white">Connecting...</div>
	</div>
{/if}
