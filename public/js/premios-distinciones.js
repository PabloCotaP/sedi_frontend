(function setupPremios(){
  const tabla = document.getElementById('tabla-premios');
  if (!tabla) return;

  const vistaLista = document.getElementById('vista-lista');
  const vistaFormulario = document.getElementById('vista-formulario');
  const btnAgregar = document.getElementById('btn-agregar');
  const btnRegresar = document.getElementById('btn-regresar');
  const formulario = document.querySelector('#vista-formulario form');

  let premios = [];
  let editandoIndex = null;

  function renderizarTabla() {
    if (!tabla) return;
    if (premios.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="2" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
      return;
    }

    tabla.innerHTML = premios.map((item,index)=>`
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-400 px-4 py-3 text-black">${item.descripcion}</td>
        <td class="border border-gray-400 px-4 py-3">
          <div class="flex justify-center items-center gap-3">
            <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">🔍</button>
            <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">✏️</button>
            <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('#tabla-premios .btn-ver').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const idx = parseInt(btn.getAttribute('data-index')||'0',10);
        const it = premios[idx];
        alert(`Descripción:\n\n${it.descripcion}`);
      });
    });

    document.querySelectorAll('#tabla-premios .btn-editar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const idx = parseInt(btn.getAttribute('data-index')||'0',10);
        editandoIndex = idx;
        const it = premios[idx];
        const ta = document.getElementById('descripcion');
        if (ta) ta.value = it.descripcion;
        vistaLista?.classList.add('hidden');
        vistaFormulario?.classList.remove('hidden');
      });
    });

    document.querySelectorAll('#tabla-premios .btn-eliminar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
        const idx = parseInt(btn.getAttribute('data-index')||'0',10);
        premios.splice(idx,1);
        renderizarTabla();
      });
    });
  }

  btnAgregar?.addEventListener('click', ()=>{
    editandoIndex = null;
    formulario && formulario.reset();
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
    const premio = { descripcion: formData.get('descripcion') || '', documento: formData.get('documento') || null };
    if (editandoIndex !== null) { premios[editandoIndex] = premio; editandoIndex = null; }
    else { premios.push(premio); }
    renderizarTabla();
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  renderizarTabla();
})();