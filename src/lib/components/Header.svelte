<script lang="ts">
	export let showUserInfo = false;
	export let userEmail: string | null = null;
	export let onLogout: (() => void) | null = null;
</script>

<header class="bg-[#3d3d3d] text-white px-4 py-6 sm:px-8 border-b-4 border-[#8b7355] shadow-md">
	<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
		<div class="text-center md:text-left">
			<h1 class="text-base sm:text-xl font-bold tracking-wide leading-snug m-0">
				UNIVERSIDAD AUTÓNOMA DE BAJA CALIFORNIA
			</h1>
			<p class="text-sm sm:text-base font-semibold mt-1 tracking-wide">
				FACULTAD DE INGENIERÍA, ARQUITECTURA Y DISEÑO
			</p>
			<p class="text-xs sm:text-sm mt-1 italic opacity-95">
				SISTEMA DE EXPEDIENTE ACADÉMICO
			</p>
		</div>
		{#if showUserInfo}
			<div class="flex flex-col items-center md:items-end gap-2">
				{#if userEmail}
					<p class="text-sm opacity-90 m-0">{userEmail}</p>
				{/if}
				{#if onLogout}
					<button 
						on:click={onLogout} 
						class="bg-[#8b7355] hover:bg-[#7a6349] text-white px-4 py-2 rounded-md text-sm transition-colors duration-300 cursor-pointer border-none"
					>
						Cerrar sesión
					</button>
				{/if}
			</div>
		{/if}
	</div>
</header>
