document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('user_email');
    if(!email) {
        window.location.href = '/';
        return;
    }
    const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
    if(headerEmailElement) {
        headerEmailElement.textContent = email;
    }
    const vistaLista = document.getElementById('vista-lista');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnRegresar = document.getElementById('btn-regresar');
    const tablaActualizacion = document.getElementById('tabla-actualizacion');
    const guardarBtn = document.getElementById('guardar-btn');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn')

    let actualizaciones = [];

     function renderizarTabla() {
    if (!tablaActualizacion) return;

    if (actualizaciones.length === 0) {
      tablaActualizacion.innerHTML = `
        <tr>
          <td colspan="6" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
       } else {
      tablaActualizacion.innerHTML = actualizaciones.map((item, index) => `
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.tipo}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.institucion}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.pais}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.anio}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.horas}</td>
          <td class="border border-gray-300 px-4 py-3 text-center">
            <div class="flex justify-center items-center gap-3">
                <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">🔍</button>
                <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">✏️</button>
                <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">🗑️</button>
              </div>
          </td>
        </tr>
      `).join('');
    }

    document.querySelectorAll('.btn-editar').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(button.getAttribute('data-index'), 10);
        const item = capacitaciones[index];
        cargarEnFormulario(item, index);
        vistaLista?.classList.add('hidden');
        vistaFormulario?.classList.remove('hidden');
        });
    });
    }

    function cargarEnFormulario(item,index) {
        document.getElementById('tipo-actualizacion').value = item.tipo;
        document.getElementById('institucion-input').value = item.institucion;
        document.getElementById('pais-input').value = item.pais;
        document.getElementById('anio-input').value = item.anio;
        document.getElementById('horas-input').value = item.horas;
        if(fileNameDisplay) fileNameDisplay.textContent = item.archivoNombre || 'Ningún archivo seleccionado';
        cargarEnFormulario.editandoIndex = index;
    }

    function resetearFormulario() {
        document.getElementById('tipo-actualizacion').value = '';
        document.getElementById('institucion-input').value = '';
        document.getElementById('pais-input').value = '';
        document.getElementById('anio-input').value = '';
        document.getElementById('horas-input').value = '';
        if(fileNameDisplay) fileNameDisplay.textContent = 'Ningún archivo seleccionado';
        if(fileInput) fileInput.value = '';
        cargarEnFormulario.editandoIndex = null;
    }
    if(btnAgregar){
    btnAgregar.addEventListener('click', () => {
    vistaLista?.classList.add('hidden');
    vistaFormulario?.classList.remove('hidden');
  });
  }

  if(btnRegresar){
    btnRegresar.addEventListener('click', () => {
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    resetearFormulario();
  });
  }

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        fileNameDisplay.textContent = file.name;
      } else {
        fileNameDisplay.textContent = 'No hay archivo seleccionado';
      }
    });
  }

  if (guardarBtn) {
    guardarBtn.addEventListener('click', () => {
      const tipo = document.getElementById('tipo-actualizacion').value.trim();
      const institucion = document.getElementById('institucion-input').value.trim();
      const pais = document.getElementById('pais-input').value.trim();
      const anio = document.getElementById('anio-input').value;
      const horas = document.getElementById('horas-input').value.trim();
      const archivo = fileNameDisplay?.textContent || '';

      if (!tipo) {
        alert('Por favor completa el campo "Tipo de actualizacion".');
        return;
      }

      const nuevaActualizacion = {tipo,institucion,pais,anio,horas,archivo };

      const editandoIndex = cargarEnFormulario.editandoIndex;
      if (editandoIndex !== undefined && editandoIndex !== null) {
        actualizaciones[editandoIndex] = nuevaActualizacion;
      } else {
        actualizaciones.push(nuevaActualizacion);
      }

        renderizarTabla();
        vistaFormulario?.classList.add('hidden');
        vistaLista?.classList.remove('hidden');
        resetearFormulario();
    });
  }
    renderizarTabla();
})();