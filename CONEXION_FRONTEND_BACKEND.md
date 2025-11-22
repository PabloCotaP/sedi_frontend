# SEDI - Guía de Conexión Frontend-Backend

## Instrucciones paso a paso para levantar los servidores

### Requisitos
- PHP (8.2+)
- Composer (gestor de dependencias PHP)
- Node.js y npm (para el frontend)

Si ya instalaste PHP y Composer (como en este entorno), puedes seguir directamente.

---

### A) Levantar el backend (Laravel) — pasos rápidos

1. Abre PowerShell y entra a la carpeta del backend:
```powershell
# en mi caso es:
cd d:\programacion\sedi\sedi_backend
```

2. Copia el archivo de entorno y ajústalo si es necesario:

```powershell
copy .env.example .env
# Si vas a usar una base remota, edita .env y configura DB_* con las credenciales
# Para desarrollo local con SQLite (recomendado si no quieres usar MySQL local):
# Asegúrate de que .env contenga:
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite
```

3. Crear el archivo SQLite (de momento solo para pruebas):

```powershell
New-Item -Path database\database.sqlite -ItemType File -Force
```

4. Instalar dependencias de PHP (Composer):

```powershell
# Instala dependencias (usa --no-dev si no necesitas paquetes de desarrollo)
composer install --no-dev --ignore-platform-reqs
```

5. Generar la clave de la aplicación y ejecutar migraciones:

```powershell
php artisan key:generate
php artisan migrate
```

6. Levantar el servidor de desarrollo de Laravel:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

El backend quedará disponible en: `http://127.0.0.1:8000` (o `http://localhost:8000`).

---

### B) Levantar el frontend (Astro) — pasos rápidos

1. Abre otra ventana de PowerShell y entra a la carpeta del frontend:

```powershell
cd d:\programacion\sedi\sedi_frontend
```

2. Instala dependencias de Node (si no lo hiciste ya):

```powershell
npm install
```

3. Levanta el servidor de desarrollo de Astro:

```powershell
npm run dev
```

El frontend quedará disponible en: `http://localhost:4321`.

---

### C) Verificar conexión entre frontend y backend

- Abre en el navegador: `http://localhost:4321/test-api` y haz clic en "Probar Conexión con Backend".
- También puedes probar directamente el endpoint del backend:

```powershell
curl http://127.0.0.1:8000/api/test
```

Si todo está correctamente configurado verás la respuesta JSON desde Laravel.

---

### Notas y soluciones de problemas comunes
- Si Composer pide versiones de PHP incompatibles, puedes instalar sin dependencias de desarrollo usando `--no-dev`, o actualizar PHP a la versión requerida.
- Si las dependencias no se descargan por falta de la extensión `zip`, Composer puede clonar desde git; instala `php-zip` si lo deseas para descargas más rápidas.
- Si el frontend muestra errores CORS, revisa `config/cors.php` en el backend y verifica que `allowed_origins` incluya `http://localhost:4321`.
- Si la base de datos es remota, no ejecutes `php artisan migrate` en producción sin permiso; pide al encargado del backend que ejecute migraciones en staging/producción.

---

## Tips

- No modifiques el backend a menos que sea necesario
- Todas tus peticiones deben usar el helper `fetchAPI`
- El CORS ya está configurado, no necesitas preocuparte por eso
- Los errores se manejan automáticamente en el helper
- Puedes agregar más funciones helper en `api.ts`

---

## Estado Actual

### Backend (Laravel)
- Dependencias instaladas
- Base de datos migrada
- Servidor corriendo en `http://localhost:8000`
- CORS configurado para `http://localhost:4321`
- Ruta API de prueba: `http://localhost:8000/api/test`

### Frontend (Astro)
- Servidor corriendo en `http://localhost:4321`
- Helper API creado en `src/lib/api.ts`
- Página de prueba: `http://localhost:4321/test-api`

---

## Cómo Usar la API en el Frontend

### 1. Importa el helper
```typescript
import { fetchAPI } from '../lib/api';
```

### 2. Haz peticiones GET
```typescript
// En un componente .astro (lado servidor)
const data = await fetchAPI('/test');

// En un script del cliente
<script>
  import { fetchAPI } from '../lib/api';
  
  const data = await fetchAPI('/test');
  console.log(data);
</script>
```

### 3. Haz peticiones POST
```typescript
const response = await fetchAPI('/tu-endpoint', {
  method: 'POST',
  body: JSON.stringify({
    nombre: 'Juan',
    email: 'juan@example.com'
  })
});
```

### 4. Haz peticiones con autenticación
Si necesitas enviar cookies (para sesiones):
```typescript
const response = await fetchAPI('/user', {
  credentials: 'include' // Descomenta esta línea en api.ts
});
```

---

## Estructura de Archivos Importantes

### Backend
- `routes/api.php` - Define todas las rutas de API
- `app/Models/` - Modelos de Eloquent (ya creados)
- `config/cors.php` - Configuración CORS
- `.env` - Variables de entorno

### Frontend
- `src/lib/api.ts` - Helper para peticiones API
- `src/pages/test-api.astro` - Página de prueba de conexión
- Todas tus páginas en `src/pages/`

---

## Comandos Útiles

### Backend (desde `sedi_backend/`)
```powershell
# Levantar servidor
php artisan serve

# Ver rutas disponibles
php artisan route:list

# Crear un nuevo controlador
php artisan make:controller NombreController

# Crear un nuevo modelo
php artisan make:model NombreModelo -m

# Ejecutar migraciones
php artisan migrate

# Limpiar caché
php artisan cache:clear
php artisan config:clear
```

### Frontend (desde `sedi_frontend/`)
```powershell
# Levantar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

---

## URLs Importantes

- **Frontend**: http://localhost:4321
- **Backend**: http://localhost:8000
- **Test API**: http://localhost:4321/test-api
- **API Test Endpoint**: http://localhost:8000/api/test

---

## Crear Nuevas Rutas API

### En el Backend (`routes/api.php`)
```php
// GET request
Route::get('/usuarios', function () {
    return response()->json([
        'usuarios' => Usuario::all()
    ]);
});

// POST request
Route::post('/usuarios', function (Request $request) {
    $usuario = Usuario::create($request->all());
    return response()->json($usuario, 201);
});

// Con controlador
Route::get('/usuarios', [UsuarioController::class, 'index']);
```

### En el Frontend
```typescript
// Usa el helper
const usuarios = await fetchAPI('/usuarios');

// O crea funciones específicas en api.ts
export async function getUsuarios() {
  return fetchAPI<Usuario[]>('/usuarios');
}
```

---

## Autenticación (cuando la necesites)

El backend tiene los modelos listos. Cuando el encargado del backend configure autenticación:

1. **Laravel Sanctum** (recomendado para SPA):
```typescript
// Login
await fetchAPI('/login', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ email, password })
});

// Peticiones autenticadas
await fetchAPI('/user', {
  credentials: 'include'
});
```

2. **Bearer Token**:
```typescript
const token = 'tu-token-aqui';
await fetchAPI('/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Troubleshooting

### Error CORS
- Verifica que `config/cors.php` tenga `http://localhost:4321` en `allowed_origins`
- Si cambias el puerto del frontend, actualiza el CORS

### Error 404 en API
- Verifica que la ruta esté en `routes/api.php`
- Ejecuta `php artisan route:list` para ver todas las rutas

### Base de Datos
- El proyecto usa SQLite local en desarrollo
- Cuando el encargado del backend configure MySQL remoto, te pasará las credenciales
- Solo actualiza el `.env` del backend (no toques migraciones)

---

## Modelos Disponibles

El backend ya tiene estos modelos creados:
- `Carrera`
- `DocumentoDetalle`
- `Formacione`
- `InfoExtra`
- `Institucion`
- `NivelesFormacione`
- `NivelesNombramiento`
- `Nombramiento`
- `Pais`
- `Registro`
- `Rol`
- `TipoDocumento`
- `Usuario`

---

## Siguiente Paso

1. Abre http://localhost:4321/test-api
2. Haz clic en "Probar Conexión con Backend"
3. Si ves el mensaje de éxito, ¡todo está funcionando!
4. Usa `src/lib/api.ts` para todas tus peticiones

---
