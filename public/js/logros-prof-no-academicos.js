(function(){
  const vistaLista = document.getElementById('vista-lista');
  const vistaFormulario = document.getElementById('vista-formulario');
  const btnAgregar = document.getElementById('btn-agregar');
  const btnRegresar = document.getElementById('btn-regresar');
  const tabla = document.getElementById('tabla-participaciones');
  const formulario = document.querySelector('#vista-formulario form');

  if (!tabla) return;

  let items = [];
  let editIndex = null;

  function escapeHtml(str){
    if (str == null) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function renderTabla(){
    if (!tabla) return;
    if (items.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="2" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
      return;
    }

    tabla.innerHTML = items.map((it, idx) => `
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.capacitacion)} — ${escapeHtml(it.institucion)} (${escapeHtml(it.pais)}) — ${escapeHtml(it.anio_obt)} — ${escapeHtml(it.horas)}h</td>
        <td class="border border-gray-400 px-4 py-3 text-center">
          <div class="flex justify-center items-center gap-3">
            <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${idx}" title="Ver"></button>
            <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${idx}" title="Editar"></button>
            <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${idx}" title="Eliminar"></button>
          </div>
        </td>
      </tr>
    `).join('');

    tabla.querySelectorAll('.btn-ver').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-index'));
        const it = items[i];
        alert(`Logro:\n\nTipo: ${it.capacitacion}\nInstitución: ${it.institucion}\nPaís: ${it.pais}\nAño: ${it.anio_obt}\nHoras: ${it.horas}`);
      });
    });

    tabla.querySelectorAll('.btn-editar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-index'));
        editIndex = i;
        const it = items[i];
        const inCap = document.getElementById('capacitacion');
        const inInst = document.getElementById('institucion');
        const inPais = document.getElementById('pais');
        const inAnio = document.getElementById('anio_obt');
        const inHoras = document.getElementById('horas');
        if (inCap) inCap.value = it.capacitacion || '';
        if (inInst) inInst.value = it.institucion || '';
        if (inPais) inPais.value = it.pais || '';
        if (inAnio) inAnio.value = it.anio_obt || '';
        if (inHoras) inHoras.value = it.horas || '';
        vistaLista?.classList.add('hidden');
        vistaFormulario?.classList.remove('hidden');
      });
    });

    tabla.querySelectorAll('.btn-eliminar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
        const i = Number(btn.getAttribute('data-index'));
        items.splice(i,1);
        renderTabla();
      });
    });
  }

  btnAgregar?.addEventListener('click', ()=>{
    editIndex = null;
    formulario && formulario.reset();
    vistaLista?.classList.add('hidden');
    vistaFormulario?.classList.remove('hidden');
  });

  btnRegresar?.addEventListener('click', ()=>{
    editIndex = null;
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  formulario?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = {
      capacitacion: String(fd.get('capacitacion')||''),
      institucion: String(fd.get('institucion')||''),
      pais: String(fd.get('pais')||''),
      anio_obt: String(fd.get('anio_obt')||''),
      horas: String(fd.get('horas')||''),
      documento: fd.get('documento') ? (fd.get('documento').name || null) : null
    };
    if (editIndex !== null) {
      items[editIndex] = obj;
      editIndex = null;
    } else {
      items.push(obj);
    }
    renderTabla();
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  
  renderTabla();
})();
