# SEDI Frontend - Sistema de Expediente Académico

Sistema web para la gestión del expediente académico de la Facultad de Ingeniería, Arquitectura y Diseño - UABC.

## Equipo 2 - Frontend

### Integrantes del equipo:
- Kevin Emmanuel Valdez Vanderas
- Raymundo Miguel Aguilera
- Jose Alonso Lopez Michel

## Tecnologías

- **Astro** - Framework web moderno y rápido
- **HTML** - Markup semántico
- **Tailwind CSS** - Estilos utilitarios
- **TypeScript** - Tipado estático
- **Chart.js** - Gráficas y visualizaciones

## Estructura del Proyecto

```
/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes Astro reutilizables
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Sidebar.astro
│   ├── layouts/         # Layouts de página
│   │   └── BaseLayout.astro
│   ├── pages/           # Páginas (rutas automáticas)
│   │   ├── index.astro           # Login
│   │   ├── dashboard.astro       # Dashboard principal
│   │   ├── informacion-personal.astro
│   │   ├── apartados.astro
│   │   ├── info-academica.astro
│   │   ├── prod-academicos.astro
│   │   ├── capa-docente.astro
│   │   └── act-disciplinar.astro
│   └── styles/          # Estilos globales
│       └── global.css
├── astro.config.mjs     # Configuración de Astro
├── tailwind.config.js   # Configuración de Tailwind
└── package.json
```

## Comandos

| Comando                | Acción                                       |
| :--------------------- | :------------------------------------------- |
| `npm install`          | Instala las dependencias                     |
| `npm run dev`          | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build`        | Construye el sitio para producción en `./dist/` |
| `npm run preview`      | Previsualiza la build localmente             |
| `npm run astro`        | Ejecuta comandos de Astro CLI                |

## Desarrollo

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

3. Abrir el navegador en `http://localhost:4321`

## Características

- ✅ Enrutamiento basado en archivos
- ✅ Componentes Astro puros (sin frameworks)
- ✅ Tailwind CSS para estilos
- ✅ TypeScript para tipado
- ✅ Chart.js para visualizaciones
- ✅ Autenticación simulada con localStorage
- ✅ Responsive design
- ✅ Navegación con sidebar
- ✅ Sistema de formularios

## Páginas

- **/** - Login (página principal)
- **/dashboard** - Dashboard con gráfica de progreso
- **/informacion-personal** - Formulario de datos personales
- **/apartados** - Selector de apartados académicos
- **/info-academica** - Formación académica
- **/prod-academicos** - Producción académica (en desarrollo)
- **/capa-docente** - Capacitación docente (en desarrollo)
- **/act-disciplinar** - Acta disciplinar (en desarrollo)

## Notas

- El proyecto utiliza localStorage para simular autenticación
- Las funcionalidades de guardado son simuladas hasta la implementación del backend
- Los estilos siguen la paleta de colores de la UABC

## Licencia

© 2025 Universidad Autónoma de Baja California