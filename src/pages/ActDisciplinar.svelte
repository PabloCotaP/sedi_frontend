<script lang="ts">
	import { push } from 'svelte-spa-router';
	import Header from '../lib/components/Header.svelte';
	import Footer from '../lib/components/Footer.svelte';
	import Sidebar from '../lib/components/Sidebar.svelte';

	let sidebarOpen = false;

	function logout() {
		localStorage.removeItem('user_email');
		push('/');
	}

	function volver() {
		push('/Apartados');
	}
</script>

<Sidebar bind:isOpen={sidebarOpen} onLogout={logout} />

<div class="flex flex-col min-h-screen">
	<Header showUserInfo={false} />

	<main class="flex-1 bg-gray-100 p-6">
		<div class="max-w-4xl mx-auto">
			<div class="bg-white rounded-lg shadow-lg p-6">
				<h1 class="text-3xl font-bold text-gray-800 mb-4">Acta Disciplinar</h1>
				<p class="text-gray-600 mb-6">Contenido en desarrollo. Aquí podrás acceder a tu historial y registros disciplinares.</p>
				
				<button on:click={volver} class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow transition-colors">
					← Volver
				</button>
			</div>
		</div>
	</main>

	<Footer />
</div>
