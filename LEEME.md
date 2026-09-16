# Ricardo Riffo Propiedades — Sitio web (Fase 4)

Este es el proyecto real del sitio, con las mismas dos pantallas que ya viste en los mockups
(inicio y ficha de propiedad), pero como código que funciona de verdad, usando 6 propiedades
de ejemplo.

## Cómo subirlo a internet (sin usar terminal)

1. Entra a github.com, inicia sesión, y haz clic en el botón verde **"New"** (o el ícono **+**
   arriba a la derecha → **"New repository"**).
2. Ponle de nombre `ricardo-riffo-web`, déjalo en **Public** o **Private** (cualquiera sirve),
   y NO marques ninguna casilla adicional. Haz clic en **"Create repository"**.
3. En la página que aparece, busca el link que dice **"uploading an existing file"**.
4. Arrastra **todos los archivos y carpetas de este proyecto** (menos la carpeta `node_modules`,
   que no hace falta subir) a esa página, y espera a que termine de cargar.
5. Escribe cualquier mensaje abajo (ej. "Primera versión") y haz clic en **"Commit changes"**.
6. Ve a vercel.com, entra con tu cuenta (la que conectaste a GitHub), haz clic en **"Add New" →
   "Project"**, y elige el repositorio `ricardo-riffo-web` que acabas de crear.
7. Deja todas las opciones como están y haz clic en **"Deploy"**. En 1-2 minutos vas a tener
   un link (algo como `ricardo-riffo-web.vercel.app`) donde el sitio ya está publicado y
   funcionando.

Cuando compres el dominio `ricardoriffo.cl`, en Vercel hay una sección "Domains" donde se
conecta — eso lo vemos juntos cuando llegue el momento.

## Qué hay en este proyecto

- `app/page.js` — la página de inicio
- `app/propiedades/[slug]/page.js` — la ficha de una propiedad (una sola plantilla que sirve
  para cualquier propiedad, según sus datos)
- `lib/properties.js` — los datos de las 6 propiedades de ejemplo. **Esto es lo que en la
  Fase 5 se reemplaza por la conexión a la base de datos real**, para que puedas cargar tus
  60 propiedades.
- `components/` — piezas reutilizables (encabezado, pie de página, tarjeta de propiedad)
- `app/globals.css` — todos los colores, tipografías y estilos del sitio, en un solo lugar
