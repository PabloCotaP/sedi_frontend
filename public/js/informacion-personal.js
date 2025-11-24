const vistaLista = document.getElementById('vista-lista');
const vistaFormulario = document.getElementById('vista-formulario');
const btnAgregar = document.getElementById('btn-agregar');
const btnRegresar = document.getElementById('btn-regresar');
const form = document.getElementById('info-form');

function safeGet(id) {
  return document.getElementById(id) || { value: '' };
}

function setP(label, value) {
  if (!vistaLista) return;
  const p = Array.from(vistaLista.querySelectorAll('p'))
    .find(pp => pp.textContent.trim().startsWith(label));
  if (p) p.innerHTML = `<span class="font-semibold">${label}:</span> ${value}`;
}

function updateListaFromValues(values) {
  if (!vistaLista) return;
  const map = {
    'Nombre(s)': 'show_fullName',
    'Apellido paterno': 'show_apellidoP',
    'Apellido materno': 'show_apellidoM',
    'Fecha de nacimiento': 'show_birthDate',
    'Nombramiento actual': 'show_nombramiento',
    'Fecha de contratación': 'show_fechaContratacion',
    'Cédula profesional': 'show_cedula'
  };

  Object.keys(map).forEach(key => {
    const id = map[key];
    const el = document.getElementById(id);
    if (el) el.value = values[key] || '';
  });
}

if (btnAgregar && vistaLista && vistaFormulario) {
  btnAgregar.addEventListener('click', () => {
    safeGet('fullName').value = (document.getElementById('show_fullName') || {}).value || '';
    safeGet('apellidoP').value = (document.getElementById('show_apellidoP') || {}).value || '';
    safeGet('apellidoM').value = (document.getElementById('show_apellidoM') || {}).value || '';
    safeGet('birthDate').value = (document.getElementById('show_birthDate') || {}).value || '';
    safeGet('nombramiento').value = (document.getElementById('show_nombramiento') || {}).value || '';
    safeGet('fechaContratacion').value = (document.getElementById('show_fechaContratacion') || {}).value || '';
    safeGet('cedula').value = (document.getElementById('show_cedula') || {}).value || '';

    vistaLista.classList.add('hidden');
    vistaFormulario.classList.remove('hidden');
  });
}

if (btnRegresar && vistaLista && vistaFormulario) {
  btnRegresar.addEventListener('click', () => {
    vistaFormulario.classList.add('hidden');
    vistaLista.classList.remove('hidden');
  });
}

if (form && vistaLista && vistaFormulario) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const values = {
      'Nombre(s)': safeGet('fullName').value,
      'Apellido paterno': safeGet('apellidoP').value,
      'Apellido materno': safeGet('apellidoM').value,
      'Fecha de nacimiento': safeGet('birthDate').value,
      'Nombramiento actual': safeGet('nombramiento').value,
      'Fecha de contratación': safeGet('fechaContratacion').value,
      'Cédula profesional': safeGet('cedula').value
    };

    updateListaFromValues(values);

    alert('Cambios guardados correctamente (simulación sin backend)');

    vistaFormulario.classList.add('hidden');
    vistaLista.classList.remove('hidden');
  });
}


function initSync() {
  if (!vistaLista || !form) return;

  const inputs = ['fullName','apellidoP','apellidoM','birthDate','nombramiento','fechaContratacion','cedula'];
  const hasFormValues = inputs.some(id => (safeGet(id).value || '').toString().trim() !== '');

  if (hasFormValues) {
    const values = {
      'Nombre(s)': safeGet('fullName').value,
      'Apellido paterno': safeGet('apellidoP').value,
      'Apellido materno': safeGet('apellidoM').value,
      'Fecha de nacimiento': safeGet('birthDate').value,
      'Nombramiento actual': safeGet('nombramiento').value,
      'Fecha de contratación': safeGet('fechaContratacion').value,
      'Cédula profesional': safeGet('cedula').value
    };
    updateListaFromValues(values);
  } else {
    safeGet('fullName').value = (document.getElementById('show_fullName') || {}).value || '';
    safeGet('apellidoP').value = (document.getElementById('show_apellidoP') || {}).value || '';
    safeGet('apellidoM').value = (document.getElementById('show_apellidoM') || {}).value || '';
    safeGet('birthDate').value = (document.getElementById('show_birthDate') || {}).value || '';
    safeGet('nombramiento').value = (document.getElementById('show_nombramiento') || {}).value || '';
    safeGet('fechaContratacion').value = (document.getElementById('show_fechaContratacion') || {}).value || '';
    safeGet('cedula').value = (document.getElementById('show_cedula') || {}).value || '';
    const values = {
      'Nombre(s)': (document.getElementById('show_fullName') || {}).value || '',
      'Apellido paterno': (document.getElementById('show_apellidoP') || {}).value || '',
      'Apellido materno': (document.getElementById('show_apellidoM') || {}).value || '',
      'Fecha de nacimiento': (document.getElementById('show_birthDate') || {}).value || '',
      'Nombramiento actual': (document.getElementById('show_nombramiento') || {}).value || '',
      'Fecha de contratación': (document.getElementById('show_fechaContratacion') || {}).value || '',
      'Cédula profesional': (document.getElementById('show_cedula') || {}).value || ''
    };
    updateListaFromValues(values);
  }
}

initSync();

