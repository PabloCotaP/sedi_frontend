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
</script>

<Sidebar bind:isOpen={sidebarOpen} onLogout={logout} />

<div class="flex flex-col min-h-screen">
	<Header showUserInfo={false} />

	<main class="flex-1 bg-gray-100 p-6">
		<div class="max-w-4xl mx-auto">
			<div class="bg-white rounded-lg shadow-lg p-8">
				<h1 class="text-3xl font-bold text-gray-800 mb-6">👤 Información Personal</h1>
				
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label for="fullName" class="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
							<input id="fullName" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b7355]" placeholder="Juan Pérez García" />
						</div>

						<div>
							<label for="institutionalEmail" class="block text-sm font-semibold text-gray-700 mb-2">Correo institucional</label>
							<input id="institutionalEmail" type="email" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b7355]" placeholder="juan.perez@uabc.edu.mx" />
						</div>

						<div>
							<label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
							<input id="phone" type="tel" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b7355]" placeholder="664-123-4567" />
						</div>

						<div>
							<label for="department" class="block text-sm font-semibold text-gray-700 mb-2">Departamento</label>
							<input id="department" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b7355]" placeholder="Ciencias de la Computación" />
						</div>

						<div>
							<label for="rfc" class="block text-sm font-semibold text-gray-700 mb-2">RFC</label>
							<input id="rfc" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b7355]" placeholder="PEGJ800101XXX" />
						</div>

						<div>
							<label for="curp" class="block text-sm font-semibold text-gray-700 mb-2">CURP</label>
							<input id="curp" type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8b7355]" placeholder="PEGJ800101HBCRNN00" />
						</div>
					</div>

					<div class="flex justify-end gap-4 mt-8">
						<button class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
							Cancelar
						</button>
						<button class="bg-[#8b7355] hover:bg-[#7a6349] text-white px-6 py-2 rounded-lg transition-colors">
							Guardar cambios
						</button>
					</div>
				</div>
			</div>
		</div>
	</main>

	<Footer />
</div>
