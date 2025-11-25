(function setupParticipacion(){
  const tabla = document.getElementById('tabla-participaciones');
  if (!tabla) return;

  const vistaLista = document.getElementById('vista-lista');
  const vistaFormulario = document.getElementById('vista-formulario');
  const btnAgregar = document.getElementById('btn-agregar');
  const btnRegresar = document.getElementById('btn-regresar');
  const formulario = document.querySelector('#vista-formulario form');

  let participaciones = [];
  let editandoIndex = null;

  function renderizarTabla() {
    if (!tabla) return;
    if (participaciones.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="4" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
      return;
    }

    tabla.innerHTML = participaciones.map((item, index) => `
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-400 px-4 py-3 text-black">${item.organismo}</td>
        <td class="border border-gray-400 px-4 py-3 text-black">${item.periodo}</td>
        <td class="border border-gray-400 px-4 py-3 text-black">${item.nivelParticipacion}</td>
        <td class="border border-gray-400 px-4 py-3">
          <div class="flex justify-center items-center gap-3">
            <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">A</button>
            <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">B</button>
            <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">C</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('#tabla-participaciones .btn-ver').forEach(btn => {
      btn.addEventListener('click', (e)=>{
        const idx = parseInt(btn.getAttribute('data-index') || '0',10);
        const item = participaciones[idx];
        alert(`Organismo: ${item.organismo}\nPeriodo: ${item.periodo}\nNivel: ${item.nivelParticipacion}`);
      });
    });

    document.querySelectorAll('#tabla-participaciones .btn-editar').forEach(btn => {
      btn.addEventListener('click', ()=>{
        const idx = parseInt(btn.getAttribute('data-index') || '0',10);
        editandoIndex = idx;
        const item = participaciones[idx];
        const inOrganismo = document.getElementById('organismo');
        const inPeriodo = document.getElementById('periodo');
        const inNivel = document.getElementById('nivel');
        if (inOrganismo) inOrganismo.value = item.organismo;
        if (inPeriodo) inPeriodo.value = item.periodo;
        if (inNivel) inNivel.value = item.nivelParticipacion;
        if (vistaLista) vistaLista.classList.add('hidden');
        if (vistaFormulario) vistaFormulario.classList.remove('hidden');
      });
    });

    document.querySelectorAll('#tabla-participaciones .btn-eliminar').forEach(btn => {
      btn.addEventListener('click', ()=>{
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
        const idx = parseInt(btn.getAttribute('data-index') || '0',10);
        participaciones.splice(idx,1);
        renderizarTabla();
      });
    });
  }

  btnAgregar?.addEventListener('click', ()=>{
    editandoIndex = null;
    formulario && (formulario.reset(), false);
    vistaLista?.classList.add('hidden');
    vistaFormulario?.classList.remove('hidden');
  });

  btnRegresar?.addEventListener('click', ()=>{
    editandoIndex = null;
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  formulario?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const participacion = {
      organismo: formData.get('organismo') || '',
      periodo: formData.get('periodo') || '',
      nivelParticipacion: formData.get('nivel') || '',
      documento: formData.get('documento') || null
    };

    if (editandoIndex !== null) {
      participaciones[editandoIndex] = participacion;
      editandoIndex = null;
    } else {
      participaciones.push(participacion);
    }

    renderizarTabla();
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  renderizarTabla();
})();