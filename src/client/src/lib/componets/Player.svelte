<script lang="ts">
	import { gameStore } from '$lib/stores/game';
	import { ActionType } from '@shared/sharedTypes';
	import { PiggyBank, Edit, User } from 'lucide-svelte';

	let showChangeAmount = $state(false);
	let amount = $state(0);

	interface Props {
		player: {
			username: string;
			chips: number;
		};
	}
	let { player }: Props = $props();

	function handleEdit(player: Props['player']) {
		showChangeAmount = true;
		amount = player.chips;
	}

	function handleSubmit() {
		gameStore.send({
			type: ActionType.EDIT_BALANCE,
			payload: { username: player.username, amount }
		});

		showChangeAmount = false;
	}
</script>

{#if showChangeAmount}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-sm rounded-lg bg-gray-800 p-6 shadow-xl">
			<h3 class="mb-4 text-xl font-bold text-white">Edit Balance</h3>

			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<span class="mb-2 block text-sm text-gray-400"> New balance </span>
					<div class="relative">
						<PiggyBank class="absolute top-3 left-3 h-5 w-5 text-yellow-500" />
						<input
							type="number"
							min={0}
							bind:value={amount}
							class="w-full rounded-lg bg-gray-700 p-3 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
						/>
					</div>
				</div>

				<div class="flex gap-3">
					<button
						type="button"
						onclick={() => (showChangeAmount = false)}
						class="flex-1 rounded-lg border border-gray-600 p-3 text-gray-400 transition-colors hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="flex-1 rounded-lg bg-yellow-500 p-3 font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
					>
						Edit
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<div class="mb-2 flex items-center rounded-lg bg-gray-800 p-4 shadow-lg">
	<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
		<User class="h-6 w-6 text-gray-400" stroke="currentColor" />
	</div>
	<div class="ml-3 flex-grow">
		<h3 class="text-lg font-medium text-white">{player.username}</h3>
		<div class="flex items-center text-yellow-500">
			<PiggyBank class="mr-1 h-4 w-4" />
			<span>{player.chips.toLocaleString()}</span>
		</div>
	</div>

	<!-- Edit button using Lucide Svelte -->
	<button
		class="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-gray-400 transition-colors hover:bg-gray-600 hover:text-white"
		onclick={() => handleEdit(player)}
		aria-label="Edit player"
	>
		<Edit class="h-4 w-4" />
	</button>
</div>
