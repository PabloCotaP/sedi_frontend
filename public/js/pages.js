(function(){
  const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
  const email = localStorage.getItem('user_email');
  if (!email && headerEmailElement) {
    window.location.href = '/';
    return;
  }
  if (headerEmailElement) {
    headerEmailElement.textContent = email;
  }

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
              <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">🔍</button>
              <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">✏️</button>
              <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">🗑️</button>
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

  (function setupAportaciones(){
    const tabla = document.getElementById('tabla-aportaciones');
    if (!tabla) return;

    const vistaLista = document.getElementById('vista-lista');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnRegresar = document.getElementById('btn-regresar');
    const formulario = document.querySelector('#vista-formulario form');
    const textarea = document.getElementById('descripcion');
    const charCount = document.getElementById('char-count');
    const wordCount = document.getElementById('word-count');

    let aportaciones = [];
    let editandoIndex = null;

    function contarPalabras(texto){
      return texto.trim().split(/\s+/).filter(w=>w.length>0).length;
    }

    textarea && textarea.addEventListener('input', ()=>{
      const texto = textarea.value;
      const palabras = contarPalabras(texto);
      const caracteres = texto.length;
      if (wordCount) wordCount.textContent = String(palabras);
      if (charCount) charCount.textContent = String(caracteres);
      if (palabras > 200) wordCount && wordCount.classList.add('text-red-600','font-bold');
      else wordCount && wordCount.classList.remove('text-red-600','font-bold');
    });

    function renderizarTabla(){
      if (!tabla) return;
      if (aportaciones.length === 0) {
        tabla.innerHTML = `
          <tr>
            <td colspan="2" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
              No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
            </td>
          </tr>
        `;
        return;
      }

      tabla.innerHTML = aportaciones.map((item,index)=>{
        const desc = (item.descripcion||'').toString();
        const short = desc.length>150?desc.substring(0,150)+"...":desc;
        return `
          <tr class="hover:bg-gray-50">
            <td class="border border-gray-400 px-4 py-3 text-black">${short}</td>
            <td class="border border-gray-400 px-4 py-3">
              <div class="flex justify-center items-center gap-3">
                <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">🔍</button>
                <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">✏️</button>
                <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      document.querySelectorAll('#tabla-aportaciones .btn-ver').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const idx = parseInt(btn.getAttribute('data-index')||'0',10);
          const it = aportaciones[idx]||{};
          const palabras = contarPalabras(it.descripcion||'');
          alert(`Descripción completa:\n\n${it.descripcion || ''}\n\n(${palabras} palabras, ${(it.descripcion||'').length} caracteres)`);
        });
      });

      document.querySelectorAll('#tabla-aportaciones .btn-editar').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const idx = parseInt(btn.getAttribute('data-index')||'0',10);
          editandoIndex = idx;
          const it = aportaciones[idx]||{};
          if (textarea) textarea.value = it.descripcion || '';
          if (wordCount) wordCount.textContent = String(contarPalabras(it.descripcion||''));
          if (charCount) charCount.textContent = String((it.descripcion||'').length);
          vistaLista?.classList.add('hidden');
          vistaFormulario?.classList.remove('hidden');
        });
      });

      document.querySelectorAll('#tabla-aportaciones .btn-eliminar').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
          const idx = parseInt(btn.getAttribute('data-index')||'0',10);
          aportaciones.splice(idx,1);
          renderizarTabla();
        });
      });
    }

    btnAgregar?.addEventListener('click', ()=>{
      editandoIndex = null;
      formulario && (formulario.reset(), false);
      if (wordCount) wordCount.textContent = '0';
      if (charCount) charCount.textContent = '0';
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
      const descripcion = formData.get('descripcion') || '';
      const palabras = contarPalabras(descripcion.toString());
      if (palabras > 200) {
        if (!confirm(`Tu descripción tiene ${palabras} palabras, que excede el límite de 200 palabras. ¿Deseas guardar de todos modos?`)) return;
      }
      const aport = { descripcion: descripcion, documento: formData.get('documento') || null };
      if (editandoIndex !== null) { aportaciones[editandoIndex] = aport; editandoIndex = null; }
      else { aportaciones.push(aport); }
      renderizarTabla();
      vistaFormulario?.classList.add('hidden');
      vistaLista?.classList.remove('hidden');
      formulario && formulario.reset();
    });

    renderizarTabla();
  })();

})();
