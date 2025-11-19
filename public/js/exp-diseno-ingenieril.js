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
      tabla.innerHTML = `\n        <tr>\n          <td colspan="4" class="border border-gray-400 px-4 py-8 text-center text-gray-500">\n            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.\n          </td>\n        </tr>\n      `;
      return;
    }

    tabla.innerHTML = items.map((it, idx) => `\n      <tr class="hover:bg-gray-50">\n        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.organismo)}</td>\n        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.periodo)}</td>\n        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.nivel)}</td>\n        <td class="border border-gray-400 px-4 py-3 text-center">\n          <div class="flex justify-center items-center gap-3">\n            <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${idx}" title="Ver">🔍</button>\n            <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${idx}" title="Editar">✏️</button>\n            <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${idx}" title="Eliminar">🗑️</button>\n          </div>\n        </td>\n      </tr>\n    `).join('');

    tabla.querySelectorAll('.btn-ver').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-index'));
        const it = items[i];
        alert(`Organismo: ${it.organismo}\nPeriodo: ${it.periodo}\nNivel: ${it.nivel}`);
      });
    });

    tabla.querySelectorAll('.btn-editar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-index'));
        editIndex = i;
        const it = items[i];
        const inOrganismo = document.getElementById('organismo');
        const inPeriodo = document.getElementById('periodo');
        const inNivel = document.getElementById('nivel');
        if (inOrganismo) inOrganismo.value = it.organismo || '';
        if (inPeriodo) inPeriodo.value = it.periodo || '';
        if (inNivel) inNivel.value = it.nivel || '';
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
      organismo: String(fd.get('organismo')||''),
      periodo: String(fd.get('periodo')||''),
      nivel: String(fd.get('nivel')||''),
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
