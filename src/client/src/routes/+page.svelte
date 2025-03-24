<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { PUBLIC_WEBSOCKET_URL } from '$env/static/public';
  import { goto } from '$app/navigation';
  import SEO from 'svelte-seo';

  let ws: WebSocket;
  let messages: any[] = [];
  let tableId = $state('');
  let username = $state('');
  let error = $state('');

  const seoProps = {
    title: 'Poker Chips Manager - Join or Create a Table',
    description: 'Manage your poker chips digitally! Join an existing table or create a new one to start playing with friends.',
    canonical: "https://yourwebsite.com/path-to-this-page",
    
    openGraph: {
      title: 'Poker Chips Manager - Online Poker Table',
      description: 'Digitally manage poker chips with your friends - join or create a virtual poker table now!',
      url: "https://yourwebsite.com/path-to-this-page",
      locale: "en_US",
      type: "website",
      site_name: 'Poker Chips Manager',
      images: [
        {
          url: 'https://yourwebsite.com/images/poker-table-preview.jpg',
          width: 1200,
          height: 630,
          alt: 'Poker Chips Manager interface'
        }
      ]
    },
    
    twitter: {
      card: 'summary_large_image',
      title: 'Poker Chips Manager - Digital Poker Experience',
      description: 'Join or create a poker table - manage your chips digitally!',
      image: 'https://yourwebsite.com/images/poker-table-preview.jpg',
      imageAlt: 'Poker Chips Manager preview'
    },
    
    additionalMetaTags: [
      {
        property: "keywords",
        content: "poker, chips manager, online poker, poker game, virtual poker, digital poker"
      },
      {
        property: "author",
        content: "Your Name or Company"
      }
    ],
    
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Poker Chips Manager",
      "applicationCategory": "GameApplication",
      "description": "Manage your poker chips digitally with friends"
    }
  };

  onMount(() => {
    username = localStorage.getItem('username') || '';
  });

  // Chiudi la connessione quando il componente viene distrutto
  onDestroy(() => {
    if (ws) ws.close();
  });

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!username.trim()) {
      error = "Username is required";
      return;
    }
    
    // Save username to localStorage
    localStorage.setItem('username', username);
    
    if (tableId) {
      joinTable();
    } else {
      error = "Please enter a table ID or create a new table";
    }
  }
  
  function handleCreate(e) {
    e.preventDefault();
    
    if (!username.trim()) {
      error = "Username is required";
      return;
    }
    
    // Save username to localStorage
    localStorage.setItem('username', username);
    
    // Navigate to create table page or create table here
    goto('/create-table');
  }
  
  function joinTable() {
    error = ''; // Reset error
    
    try {
      ws = new WebSocket(`${PUBLIC_WEBSOCKET_URL}/game?username=${username}&tableId=${tableId}`);
      
      ws.onopen = () => {
        // Connection established, navigate to game page
        goto(`/table/${tableId}`);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        messages = [...messages, data];
      };
      
      ws.onerror = (event) => {
        error = "Connection error";
        console.error("WebSocket error:", event);
      };
      
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    } catch (err) {
      error = "Failed to connect to server";
      console.error("Error creating WebSocket:", err);
    }
  }
</script>

<SEO {...seoProps} />

<div class="container mx-auto max-w-md px-4 py-8">
  <h1 class="mb-8 text-center text-4xl font-bold text-yellow-500">Poker Chips Manager</h1>
  
  <p class="mb-6 text-center text-gray-300">
    Simplify your poker game with our digital chips manager. Join friends at a virtual table or create your own in seconds.
  </p>

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
          aria-label="Your username"
          aria-required="true"
          class="w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <h2 class="mb-4 text-center text-xl font-semibold">Join a Table</h2>

      <div>
        <input
          type="text"
          placeholder="Enter table ID"
          bind:value={tableId}
          aria-label="Table ID to join"
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
        type="button"
        class="w-full cursor-pointer rounded-lg border-2 border-yellow-500 p-3 font-semibold text-yellow-500 transition-colors hover:bg-yellow-500 hover:text-gray-900"
        onclick={handleCreate}
      >
        Create New Table
      </button>
    </form>
  </div>
  
  <div class="mb-8 rounded-lg bg-gray-900 p-6 text-gray-300">
    <h2 class="mb-4 text-xl font-semibold text-yellow-400">How It Works</h2>
    <ol class="ml-5 list-decimal space-y-2">
      <li><strong>Create or Join a Table</strong> - Use the form below to either create a new poker table or join an existing one</li>
      <li><strong>Set Your Username</strong> - Let others know who's at the table</li>
      <li><strong>Manage Your Chips</strong> - Track bets, raises, and balances in real-time</li>
    </ol>
  </div>



  <div class="mt-8 text-center text-gray-400">
    <p>Join or create a table to start managing your poker chips digitally!</p>
    <p class="mt-2 text-sm">Supports up to 8 players per table with real-time chip tracking</p>
  </div>
  
  <footer class="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
    <p>Poker Chips Manager &copy; {new Date().getFullYear()}</p>
    <p class="mt-2">Secure WebSocket connection ensures real-time synchronization between all players</p>
  </footer>
</div>
