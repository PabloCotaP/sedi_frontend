<script lang="ts">
	import { push } from 'svelte-spa-router';
	import Header from '../lib/components/Header.svelte';
	import Footer from '../lib/components/Footer.svelte';
	import Sidebar from '../lib/components/Sidebar.svelte';

	let sidebarOpen = false;
	let nivel = '';
	let nombre = '';
	let institucion = '';
	let pais = '';
	let anio = '';
	let cedula = '';

	let file: File | null = null;
	let fileName = '';

	function logout() {
		localStorage.removeItem('user_email');
		push('/');
	}

	function volver() {
		push('/Apartados');
	}

	function triggerUpload() {
		const input = document.getElementById('file-input') as HTMLInputElement | null;
		input?.click();
	}

	function onFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
			fileName = file.name;
		}
	}

	function guardar() {
		if (!nivel || !nombre) {
			alert('Por favor completa los campos requeridos (Nivel y Nombre).');
			return;
		}

		const payload = { nivel, nombre, institucion, pais, anio, cedula, fileName };
		console.log('Guardar formación académica:', payload, file);
		alert('Información guardada correctamente (simulación sin backend)');
	}
</script>

<Sidebar bind:isOpen={sidebarOpen} onLogout={logout} />

<div class="flex flex-col min-h-screen">
	<Header showUserInfo={false} />

	<main class="flex-1 bg-gray-100 p-6">
		<div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
			<div class="bg-gray-200 p-6">
				<h1 class="text-4xl font-serif text-center underline mb-6">Formación académica</h1>

				<div class="grid grid-cols-12 gap-4 items-center">
					<label for="nivel-select" class="col-span-3 text-right pr-4 font-semibold">Nivel</label>
					<div class="col-span-5">
						<select id="nivel-select" bind:value={nivel} class="w-full border rounded px-3 py-1">
							<option value="">Selecciona una opción</option>
							<option>Licenciatura</option>
							<option>Maestría</option>
							<option>Doctorado</option>
							<option>Especialidad</option>
						</select>
					</div>

					<div class="col-span-4"></div>

					<label for="nombre-input" class="col-span-3 text-right pr-4 font-semibold">Nombre (Incluir especialidad)</label>
					<div class="col-span-5">
						<input id="nombre-input" bind:value={nombre} class="w-full border rounded px-3 py-1" />
					</div>

					<div class="col-span-4"></div>

					<label for="institucion-input" class="col-span-3 text-right pr-4 font-semibold">Institución</label>
					<div class="col-span-5">
						<input id="institucion-input" bind:value={institucion} class="w-full border rounded px-3 py-1" />
					</div>

					<div class="col-span-4"></div>

					<label for="pais-input" class="col-span-3 text-right pr-4 font-semibold">País</label>
					<div class="col-span-5">
						<input id="pais-input" bind:value={pais} class="w-full border rounded px-3 py-1" />
					</div>

					<div class="col-span-4"></div>

					<label for="anio-input" class="col-span-3 text-right pr-4 font-semibold">Año de obtención</label>
					<div class="col-span-5">
						<input id="anio-input" bind:value={anio} type="number" min="1900" max="2100" class="w-full border rounded px-3 py-1" />
					</div>

					<div class="col-span-4"></div>

					<label for="cedula-input" class="col-span-3 text-right pr-4 font-semibold">Cédula profesional</label>
					<div class="col-span-5">
						<input id="cedula-input" bind:value={cedula} class="w-full border rounded px-3 py-1" />
					</div>

					<div class="col-span-4"></div>

					<div class="col-span-12 flex justify-center space-x-6 mt-6">
						<button on:click={volver} class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow transition-colors">
                            ← Volver
                        </button>

						<div>
							<input id="file-input" type="file" accept="application/pdf,image/*" class="hidden" on:change={onFileChange} />
							<button on:click={triggerUpload} class="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded shadow transition-colors">
								Subir documento
							</button>
							<div class="text-sm text-gray-600 mt-2 text-center">{fileName ? fileName : 'No hay archivo seleccionado'}</div>
						</div>

						<button on:click={guardar} class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow flex items-center transition-colors">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
								<path d="M17 3H3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1zM9 14H7v-4h2v4zm4 0h-2v-6h2v6z" />
							</svg>
							Guardar
						</button>
					</div>
				</div>
			</div>
		</div>
	</main>

	<Footer />
</div>

<style>
	h1 { font-family: 'Georgia', serif; }
</style>
