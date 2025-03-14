<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Coins } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let ws: WebSocket;
	let messages: any[] = [];
	let tableId = $state('');
	let username = $state('');
	let error = $state('');

	onMount(() => {
		username = localStorage.getItem('username') || '';
	});

	// Chiudi la connessione quando il componente viene distrutto
	onDestroy(() => {
		if (ws) ws.close();
	});

	// Funzione per inviare messaggi
	function sendMessage(message: any) {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(message));
		}
	}

	function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();

		if (!tableId) error = 'If you want to join a table you must supply a table ID';
	}

	function handleCreate(ev: SubmitEvent) {
		ev.preventDefault();
		ws = new WebSocket(`ws://192.168.1.105:3000/game?username=${username}`);

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type == 'TABLE_CREATED') {
				localStorage.setItem('username', username);
				goto(data.tableId);
			}

			messages = [...messages, data];
		};
	}
</script>

<div class="mx-auto max-w-md">
	<div class="mt-8 rounded-lg bg-gray-800 p-6 shadow-xl">
		<form onsubmit={handleSubmit} class="space-y-4">
			<h2 class="mb-4 text-center text-xl font-semibold">
				Choose your username <span class="text-yellow-500">*</span>
			</h2>
			<div>
				<input
					type="text"
					placeholder="Username"
					bind:value={username}
					required
					class="w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
				/>
			</div>

			<h2 class="mb-4 text-center text-xl font-semibold">Join a Table</h2>

			<div>
				<input
					type="text"
					placeholder="Enter table ID"
					bind:value={tableId}
					class="w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
				/>
			</div>

			{#if error}
				<p class="text-red-500">{error}</p>
			{/if}

			<button
				type="submit"
				class="w-full cursor-pointer rounded-lg bg-yellow-500 p-3 font-semibold text-gray-900 transition-colors hover:bg-yellow-400"
			>
				Join Table
			</button>

			<p class="text-center text-gray-400">or</p>
			<button
				class="w-full cursor-pointer rounded-lg border-2 border-yellow-500 p-3 font-semibold text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-gray-900"
				onsubmit={handleCreate}
			>
				Create New Table
			</button>
		</form>
	</div>

	<div class="mt-8 text-center text-gray-400">
		<p>Join or create a table to start managing your poker chips digitally!</p>
	</div>
</div>
