<script lang="ts">
	import { gameStore } from '$lib/stores/game';
	import { Coins } from 'lucide-svelte';

	interface Props {
		onClose: () => void;
		maxAmount: number;
	}
	let { onClose, maxAmount }: Props = $props();

	let amount = $state(maxAmount);

	function handleSubmit(e: Event) {
		e.preventDefault();

		gameStore.send({
			type: 'WITHDRAW',
			payload: { amount }
		});
		onClose();
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
	<div class="w-full max-w-sm rounded-lg bg-gray-800 p-6 shadow-xl">
		<h3 class="mb-4 text-xl font-bold text-white">Withdraw Chips</h3>

		<form onsubmit={handleSubmit} class="space-y-4">
			<div>
				<span class="mb-2 block text-sm text-gray-400">
					Amount to withdraw (max: {maxAmount})
				</span>
				<div class="relative">
					<Coins class="absolute left-3 top-3 h-5 w-5 text-yellow-500" />
					<input
						type="number"
						max={maxAmount}
						min={0}
						bind:value={amount}
						class="w-full rounded-lg bg-gray-700 p-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
					/>
				</div>
			</div>

			<div class="flex gap-3">
				<button
					type="button"
					onclick={onClose}
					class="flex-1 rounded-lg border border-gray-600 p-3 text-gray-400 transition-colors hover:bg-gray-700"
				>
					Cancel
				</button>
				<button
					type="submit"
					class="flex-1 rounded-lg bg-yellow-500 p-3 font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
				>
					Withdraw
				</button>
			</div>
		</form>
	</div>
</div>
