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
          <td colspan="5" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
      return;
    }

    tabla.innerHTML = items.map((it, idx) => `
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.actividad)}</td>
        <td class="border border-gray-400 px-4 py-3 text-center text-black">${escapeHtml(it.organizacion)}</td>
        <td class="border border-gray-400 px-4 py-3 text-center text-black">${escapeHtml(it.de)}</td>
        <td class="border border-gray-400 px-4 py-3 text-center text-black">${escapeHtml(it.hasta)}</td>
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
        alert(`Actividad: ${it.actividad}\nOrganización: ${it.organizacion}\nDe: ${it.de}\nHasta: ${it.hasta}`);
      });
    });

    tabla.querySelectorAll('.btn-editar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-index'));
        editIndex = i;
        const it = items[i];
        const inActividad = document.getElementById('actividad');
        const inOrganizacion = document.getElementById('organizacion');
        const inDe = document.getElementById('de');
        const inHasta = document.getElementById('hasta');
        if (inActividad) inActividad.value = it.actividad || '';
        if (inOrganizacion) inOrganizacion.value = it.organizacion || '';
        if (inDe) inDe.value = it.de || '';
        if (inHasta) inHasta.value = it.hasta || '';
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
      actividad: String(fd.get('actividad')||''),
      organizacion: String(fd.get('organizacion')||''),
      de: String(fd.get('de')||''),
      hasta: String(fd.get('hasta')||''),
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
