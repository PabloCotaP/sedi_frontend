<script lang="ts">
	import { onMount } from 'svelte';
	import { push } from 'svelte-spa-router';
	import Header from '../lib/components/Header.svelte';
	import Footer from '../lib/components/Footer.svelte';
	import Sidebar from '../lib/components/Sidebar.svelte';
	import Chart from 'chart.js/auto';

	let userEmail: string | null = null;
	let sidebarOpen = false;
	let chartCanvas: HTMLCanvasElement;
	let myChart: Chart;

	onMount(() => {
		const email = localStorage.getItem('user_email');
		if (!email) {
			push('/');
			return;
		}
		userEmail = email;

		const ctx = chartCanvas.getContext('2d');
		if (ctx) {
			myChart = new Chart(ctx, {
				type: 'pie',
                data: {
                    labels: ['completado', 'pendiente'],
                    datasets: [{
                        label: 'Progreso de expediente',
                        data: [30, 70],
                        backgroundColor: [
                            'rgba(220, 53, 69, 0.8)',
                            'rgba(54, 162, 235, 0.8)'
                        ],
                        borderColor: [
                            'rgba(220, 53, 69, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								padding: 15,
								font: {
									size: 14
								}
							}
						},
						title: {
							display: true,
							text: 'Progreso de expediente',
							font: {
								size: 18,
								weight: 'bold'
							},
							padding: {
								top: 10,
								bottom: 20
							},
							color: '#6b7280'
						}
					},
					layout: {
						padding: {
							top: 0,
							bottom: 0
						}
					}
				}
			});
		}

		return () => {
			if (myChart) {
				myChart.destroy();
			}
		};
	});

	function logout() {
		localStorage.removeItem('user_email');
		push('/');
	}

	function navigateTo(route: string) {
		push(route);
	}
</script>

<Sidebar bind:isOpen={sidebarOpen} onLogout={logout} />

<div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
	<Header showUserInfo={true} {userEmail} onLogout={logout} />

	<main class="flex-1 px-4 py-12 sm:px-8 max-w-7xl mx-auto w-full">
		<div class="text-center mb-12">
			<h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
				Bienvenido al Sistema de Expediente Académico
			</h2>
		</div>

		<div class="max-w-2xl mx-auto mb-12">
			<div class="bg-white rounded-lg shadow-lg p-6">
				<div class="chart-container">
					<canvas bind:this={chartCanvas}></canvas>
				</div>
			</div>
		</div>
	</main>

	<Footer />
</div>

<style>
	.chart-container {
		position: relative;
		height: 450px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
