<script lang="ts">
	import { gameStore } from '$lib/stores/game';
	import { ActionType, type Message } from '@shared/sharedTypes';

	let messagesContainer: HTMLElement;

	$effect(() => {
		if (messagesContainer && $gameStore.messages.length > 0) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	});

	// Function to format message content based on type
	function formatMessage(message: Message) {
		const { type, payload } = message;

		switch (type) {
			case ActionType.JOIN:
				return {
					bgColor: 'bg-indigo-900/60 border border-indigo-700',
					title: 'JOIN',
					titleColor: 'text-indigo-400',
					label: 'Player Action',
					content: `<b>${message.subject}</b> joined table`
				};

			case ActionType.BET:
				return {
					bgColor: 'bg-amber-900/60 border border-amber-700',
					title: 'BET',
					titleColor: 'text-amber-400',
					label: 'Player Action',
					content: payload ? `<b>${message.subject}</b> bet: <b>${payload.amount}</b>` : ''
				};

			case ActionType.FOLD:
				return {
					bgColor: 'bg-gray-800/80 border border-gray-700',
					title: 'FOLD',
					titleColor: 'text-gray-400',
					label: 'Player Action',
					content: 'Player folded their hand'
				};

			case ActionType.CHECK:
				return {
					bgColor: 'bg-blue-900/60 border border-blue-700',
					title: 'CHECK',
					titleColor: 'text-blue-400',
					label: 'Player Action',
					content: 'Player checked'
				};

			case ActionType.RAISE:
				return {
					bgColor: 'bg-red-900/60 border border-red-700',
					title: 'RAISE',
					titleColor: 'text-red-400',
					label: 'Player Action',
					content: payload ? `Raised to: <b>$${payload.amount}</b>` : ''
				};

			case ActionType.LEAVE:
				return {
					bgColor: 'bg-gray-900/60 border border-gray-700',
					title: 'LEAVE',
					titleColor: 'text-gray-400',
					label: 'Player Action',
					content: `<b>${message.subject}</b> left the table`
				};

			case ActionType.EDIT_BALANCE:
				return {
					bgColor: 'bg-green-900/60 border border-green-700',
					title: 'EDIT BALANCE',
					titleColor: 'text-green-400',
					label: 'System Action',
					content: payload
						? `Player <b>${payload.username}</b> balance changed by <b class="${payload.amount >= 0 ? 'text-green-400' : 'text-red-400'}">$${payload.amount}</b>`
						: ''
				};

			case ActionType.WITHDRAW:
				return {
					bgColor: 'bg-green-900/60 border border-green-700',
					title: 'WITHDRAW',
					titleColor: 'text-green-400',
					label: 'Player Action',
					content: payload ? `<b>${message.subject}</b> Amount: <b>${payload.amount}</b>` : ''
				};

			case ActionType.TABLE_STATE:
				return {
					bgColor: 'bg-purple-900/60 border border-purple-700',
					title: 'TABLE STATE',
					titleColor: 'text-purple-400',
					label: 'System Update',
					content: payload
						? `Players: <b>${payload.players}</b><br>Pot: <b>$${payload.pot}</b>`
						: ''
				};

			case ActionType.ERROR:
				return {
					bgColor: 'bg-red-900/80 border border-red-800',
					title: 'ERROR',
					titleColor: 'text-red-500',
					label: payload?.code ? `Code: ${payload.code}` : 'System Error',
					content: payload
						? `<span class="font-semibold text-red-300">${payload.message}</span>`
						: ''
				};

			default:
				return {
					bgColor: 'bg-gray-800',
					title: '',
					titleColor: '',
					label: '',
					content: JSON.stringify(message)
				};
		}
	}
</script>

<div class="mx-auto space-y-4">
	<!-- Messages Section -->
	<div class="rounded-xl bg-gray-800/50 p-4">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold text-white">Messages</h2>
			<div class="text-xs text-gray-400">
				{$gameStore.messages.length} messages
			</div>
		</div>

		<div
			bind:this={messagesContainer}
			class="custom-scrollbar max-h-96 space-y-1 overflow-y-auto pr-1 text-sm"
		>
			{#each $gameStore.messages as message}
				{@const formatted = formatMessage(message)}
				<div class="mb-2 rounded-lg p-3 {formatted.bgColor}">
					{#if formatted.title}
						<div class="flex items-start justify-between">
							<span class="font-bold {formatted.titleColor}">{formatted.title}</span>
							<span class="text-xs text-gray-400">{formatted.label}</span>
						</div>
					{/if}
					{#if formatted.content}
						<div class="mt-1 text-gray-300">
							{@html formatted.content}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="mt-2 text-xs text-gray-500">• Bold text indicates important information</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(31, 41, 55, 0.5);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(75, 85, 99, 0.5);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(107, 114, 128, 0.5);
	}
</style>
