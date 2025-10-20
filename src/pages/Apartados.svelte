<script lang="ts">
	import { push } from 'svelte-spa-router';
	import Fa from 'svelte-fa';
	import { faGraduationCap, faBook, faChalkboardTeacher, faClipboard } from '@fortawesome/free-solid-svg-icons';
	import Header from '../lib/components/Header.svelte';
	import Footer from '../lib/components/Footer.svelte';
	import Sidebar from '../lib/components/Sidebar.svelte';

	let sidebarOpen = false;

	type Section = {
		title: string;
		description: string;
		route: string;
		icon: any;
		color: string;
	};

	const sections: Section[] = [
		{
			title: 'Formación Académica',
			description: 'Registra y consulta tu información académica, títulos y certificaciones',
			route: '/info-academica',
			icon: faGraduationCap,
			color: 'bg-gray-500 hover:bg-gray-600'
		},
		{
			title: 'Producción Académica',
			description: 'Gestiona tus publicaciones, artículos y trabajos académicos',
			route: '/prod-academicos',
			icon: faBook,
			color: 'bg-gray-500 hover:bg-gray-600'
		},
		{
			title: 'Capacitación Docente',
			description: 'Consulta y registra cursos, talleres y capacitaciones',
			route: '/capa-docente',
			icon: faChalkboardTeacher,
			color: 'bg-gray-500 hover:bg-gray-600'
		},
		{
			title: 'Acta Disciplinar',
			description: 'Accede a tu historial y registros disciplinares',
			route: '/act-disciplinar',
			icon: faClipboard,
			color: 'bg-gray-500 hover:bg-gray-600'
		}
	];

	function logout() {
		localStorage.removeItem('user_email');
		push('/');
	}

	function navigateTo(route: string) {
		push(route);
	}
</script>

<Sidebar bind:isOpen={sidebarOpen} onLogout={logout} />

<div class="flex flex-col min-h-screen">
	<Header showUserInfo={false} />

	<main class="flex-1 bg-gradient-to-br from-gray-50 to-blue-100 px-4 py-12 sm:px-8">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-12">
				<h1 class="text-3xl font-bold text-gray-800 mb-2">Redireccionador de Apartados</h1>
				<p class="text-lg text-gray-600">Selecciona el apartado que deseas consultar o editar</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
				{#each sections as section}
					<button
						on:click={() => navigateTo(section.route)}
						class="relative text-white border-none rounded-xl p-8 cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-2xl text-center overflow-hidden group {section.color}"
					>
						<div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
						
						<div class="relative z-10">
							<div class="text-6xl mb-4 flex justify-center">
								<Fa icon={section.icon} size="3x" />
							</div>
							<h3 class="text-xl sm:text-2xl font-bold mb-3">{section.title}</h3>
							<p class="text-sm sm:text-base opacity-95 leading-relaxed">{section.description}</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	</main>

	<Footer />
</div>
