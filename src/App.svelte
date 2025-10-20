<script lang="ts">
  import Router from 'svelte-spa-router';
  import Login from './pages/Login.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import InformacionPersonal from './pages/InformacionPersonal.svelte';
  import Apartados from './pages/Apartados.svelte';
  import InfoAcademica from './pages/InfoAcademica.svelte';
  import ProdAcademicos from './pages/ProdAcademicos.svelte';
  import CapaDocente from './pages/CapaDocente.svelte';
  import ActDisciplinar from './pages/ActDisciplinar.svelte';

  const routes = {
    '/': Login,
    '/dashboard': Dashboard,
    '/informacion-personal': InformacionPersonal,
    '/apartados': Apartados,
    '/info-academica': InfoAcademica,
    '/prod-academicos': ProdAcademicos,
    '/capa-docente': CapaDocente,
    '/act-disciplinar': ActDisciplinar,
  };
</script>

<Router {routes} />
