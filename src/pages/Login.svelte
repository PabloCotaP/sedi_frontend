<script lang="ts">
	import { push } from 'svelte-spa-router';

	let userEmail = '';

	function handleLogin() {
		if (!userEmail) {
			alert('Por favor ingresa tu correo institucional');
			return;
		}
		// De momento vamos a simular el inicio de sesión guardando el correo en localStorage hasta que se implemente el backend
		localStorage.setItem('user_email', userEmail);
		push('/dashboard');
	}
</script>

<div class="flex flex-col min-h-screen bg-gray-100">
	<header class="bg-[#3d3d3d] text-white px-4 py-6 sm:px-8 border-b-4 border-[#8b7355] text-center">
		<div class="max-w-screen-xl mx-auto">
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
	</header>

	<main class="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
		<div class="flex flex-col items-center gap-6 bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center max-w-lg w-full">
			<h2 class="text-3xl font-semibold text-gray-800 m-0">Iniciar sesión</h2>
			
			<div class="w-full">
				<input 
					type="email" 
					bind:value={userEmail}
					placeholder="correo@uabc.edu.mx"
					class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:border-transparent"
				/>
			</div>

			<button 
				on:click={handleLogin}
				class="w-full bg-[#3d3d3d] hover:bg-[#2d2d2d] text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors duration-300 cursor-pointer border-none"
			>
				Iniciar sesión
			</button>

			<p class="text-gray-500 text-base mt-2">Usa tu cuenta institucional para iniciar sesión</p>
		</div>
	</main>

	<footer class="bg-[#8b7355] text-white px-4 py-4 text-center border-t border-[#7a6349]">
		<p class="text-sm m-0">© {new Date().getFullYear()} Universidad Autónoma de Baja California</p>
	</footer>
</div>
