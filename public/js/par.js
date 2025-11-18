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
    const tablaPremios = document.getElementById('tabla-premios');
    const formulario = document.getElementById('#vista-formulario form');
    const descripcionTextarea = document.getElementById('descripcion');
    const documentoInput = document.getElementById('documento');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn');

    let premios = [];

     function renderizarTabla() {
    if (!tablaPremios) return;

    if (premios.length === 0) {
      tablaPremios.innerHTML = `
        <tr>
          <td colspan="2" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
       } else {
      tablaPremios.innerHTML = premios.map((item, index) => `
        <tr class="hover:bg-gray-50">
            <td class="border border-gray-300 px-4 py-2 text-gray-700">${descorta}</td>
            <td class="border border-gray-300 px-4 py-3 text-center">
                <button class="btn-editar bg-green-600 hover text-white rounded-full p-2 mx-1 transition-colors duration-200" data-index="${index}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    </svg>
                </button>
            </td>
        </tr>
      `).join('');
    }

    document.querySelectorAll('.btn-editar').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(button.getAttribute('data-index'), 10);
        const item = premios[index];
        cargarEnFormulario(item, index);
        vistaLista?.classList.add('hidden');
        vistaFormulario?.classList.remove('hidden');
        });
    });
    }

    function cargarEnFormulario(item,index) {
        if(descripcionTextarea) descripcionTextarea.value = item.descripcion || '';
        if(fileNameDisplay && item.documento){
            fileNameDisplay.textContent = item.documento;
        } 
        cargarEnFormulario.editandoIndex = index;
    }

    function resetearFormulario() {
        if(formulario) formulario.reset();
        if(fileNameDisplay) fileNameDisplay.textContent = 'No hay archivo seleccionado';
        cargarEnFormulario.editandoIndex = null;
    }

    if(btnAgregar){
    btnAgregar.addEventListener('click', () => {
    resetearFormulario
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

 if(formulario){
    formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const descripcion = descripcionTextarea ? descripcionTextarea.value.trim() : '';
    const archivo = documentoInput?.files?.[0] || null;

    if  (!descripcion) {
        alert('Por favor, ingresa una descripcion.');
        return;
    }

    const nuevoPremio = {
        descripcion,
        documento: archivo ? archivo.name : null
    };

    const editandoIndex = cargarEnFormulario.editandoIndex;
    if (editandoIndex !== undefined && editandoIndex !== null) {
        premios[editandoIndex] = nuevoPremio;
    } else {
        premios.push(nuevoPremio);
    }

    renderizarTabla();
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    resetearFormulario();
  });
}

if(uploadBtn && documentoInput) {
    uploadBtn.addEventListener('click', () => {
    documentoInput.click();
  });
}

if(documentoInput && fileNameDisplay) {
    documentoInput.addEventListener('change', () => {
    const file = e.target.files?.[0];
    if (file) {
        fileNameDisplay.textContent = file.name;
    } else {
        fileNameDisplay.textContent = 'No hay archivo seleccionado';
    }
    });
}
    renderizarTabla();
});