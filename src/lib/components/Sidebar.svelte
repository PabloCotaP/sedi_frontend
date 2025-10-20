<script lang="ts">
	import { push } from 'svelte-spa-router';
	import Fa from 'svelte-fa';
	import { faHome, faUser, faFolderOpen, faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

	export let isOpen = false;
	export let onLogout: () => void;

	function toggleSidebar() {
		isOpen = !isOpen;
	}

	function navigateTo(route: string) {
		push(route);
		isOpen = false;
	}

	function handleLogout() {
		onLogout();
		isOpen = false;
	}
</script>

{#if !isOpen}
	<button
		on:click={toggleSidebar}
		class="fixed top-4 left-4 z-50 bg-[#8b7355] text-white p-3 rounded-lg shadow-lg hover:bg-[#7a6349] transition-colors"
		aria-label="Toggle menu"
	>
		<Fa icon={faBars} size="lg" />
	</button>
{/if}

{#if isOpen}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
		on:click={toggleSidebar}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Escape' && toggleSidebar()}
	></div>
{/if}

<aside
	class="fixed top-0 left-0 h-full w-64 bg-[#8b7355] text-white z-40 transform transition-transform duration-300 ease-in-out shadow-2xl {isOpen ? 'translate-x-0' : '-translate-x-full'}"
>
	<div class="flex flex-col h-full">
		<div class="p-6 border-b border-[#7a6349] flex justify-between items-center">
			<h2 class="text-xl font-bold">Menú</h2>
			<button
				on:click={toggleSidebar}
				class="text-white hover:text-gray-200 transition-colors"
				aria-label="Cerrar menú"
			>
				<Fa icon={faTimes} size="lg" />
			</button>
		</div>

		<nav class="flex-1 py-4">
			<button
				on:click={() => navigateTo('/dashboard')}
				class="w-full text-left px-6 py-4 hover:bg-[#7a6349] transition-colors flex items-center gap-3 border-none bg-transparent text-white cursor-pointer"
			>
				<Fa icon={faHome} />
				<span>Inicio</span>
			</button>

			<button
				on:click={() => navigateTo('/informacion-personal')}
				class="w-full text-left px-6 py-4 hover:bg-[#7a6349] transition-colors flex items-center gap-3 border-none bg-transparent text-white cursor-pointer"
			>
				<Fa icon={faUser} />
				<span>Información Personal</span>
			</button>

			<button
				on:click={() => navigateTo('/apartados')}
				class="w-full text-left px-6 py-4 hover:bg-[#7a6349] transition-colors flex items-center gap-3 border-none bg-transparent text-white cursor-pointer"
			>
				<Fa icon={faFolderOpen} />
				<span>Redireccionador de Apartados</span>
			</button>

			<div class="border-t border-[#7a6349] my-2"></div>

			<button
				on:click={handleLogout}
				class="w-full text-left px-6 py-4 hover:bg-red-600 transition-colors flex items-center gap-3 border-none bg-transparent text-white cursor-pointer"
			>
				<Fa icon={faSignOutAlt} />
				<span>Cerrar Sesión</span>
			</button>
		</nav>

		<div class="p-4 border-t border-[#7a6349] text-center text-sm opacity-75">
			<p>UABC</p>
		</div>
	</div>
</aside>
