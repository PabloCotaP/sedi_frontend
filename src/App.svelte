<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
</script>

<main class="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
  <div class="text-center">
    <div class="flex justify-center gap-8 mb-8">
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src={viteLogo} class="h-24 hover:drop-shadow-[0_0_2em_#646cffaa] transition-all duration-300" alt="Vite Logo" />
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noreferrer">
        <img src={svelteLogo} class="h-24 hover:drop-shadow-[0_0_2em_#ff3e00aa] transition-all duration-300" alt="Svelte Logo" />
      </a>
    </div>
    
    <h1 class="text-5xl font-bold text-white mb-4">Vite + Svelte + Tailwind</h1>
    <p class="text-xl text-white/90 mb-8">
      TypeScript v5.5 • Svelte v5 • Tailwind v3.4
    </p>

    <div class="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-8">
      <Counter />
    </div>

    <p class="text-white/80 mb-4">
      Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer" class="text-white font-semibold underline hover:text-white/60 transition-colors">SvelteKit</a>, the official Svelte app framework powered by Vite!
    </p>

    <p class="text-white/60 text-sm">
      Click on the Vite and Svelte logos to learn more
    </p>
  </div>
</main>
