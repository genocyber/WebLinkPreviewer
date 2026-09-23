# 🔗 Web Link Previewer

> Una extensión ligera y de alto rendimiento para **Mozilla Firefox, Google Chrome, Brave y Microsoft Edge** que permite previsualizar cualquier enlace, imagen o vídeo en un panel flotante interactivo sin abandonar la pestaña actual.

---

## 🚀 Características principales

* **Bypass de bloqueo en marcos (X-Frame / CSP):** Elimina dinámicamente las cabeceras `X-Frame-Options` y `Content-Security-Policy` mediante `declarativeNetRequest` para previsualizar sitios web que bloquean incrustaciones.
* **Optimización extrema de rendimiento:** Lógica refactorizada basada en eventos `mouseover` y `mouseout` con eliminación total de trazado de cursor global (`mousemove`), garantizando un consumo mínimo de CPU.
* **Compatibilidad Manifest V3:** Adaptada para ejecutarse mediante Event Pages en Firefox y Service Workers en Chromium.
* **Ventana flotante interactiva:** Navega o lee el contenido de destino directamente desde el panel emergente.
* **Mover y redimensionar:** Arrastra el panel desde la cabecera o ajusta sus dimensiones desde las esquinas.
* **Fijar vista previa (Pin):** Congela el panel para mantenerlo abierto e interactuar libremente con él.
* **Formatos multimedia automáticos:** Renderizado directo de imágenes (`.png`, `.jpg`, `.webp`, `.svg`) y vídeos (`.mp4`, `.webm`, `.ogg`).
* **Integración con YouTube:** Conversión automática de URLs de YouTube a modo incrustado (*embed*).
* **Indicador de carga animado:** Barra de progreso sutil bajo el puntero mientras se procesa la previsualización.
* **Lista negra de dominios:** Desactivación configurable por dominios específicos.
* **Modo Oscuro por defecto:** Interfaz adaptable con soporte para temas claro/oscuro.

---

## ⌨️ Controles y Atajos

| Acción | Control / Atajo |
| :--- | :--- |
| **Activar previsualización** | Mantener pulsada la tecla configurada (por defecto `Shift`) + `Hover` |
| **Fijar / Descongelar panel** | Tecla `Espacio` o clic en el icono 📌 de la cabecera |
| **Cerrar ventana** | Tecla `Esc` o clic en ✖️ |
| **Abrir en nueva pestaña** | Clic en el botón ↗️ de la cabecera |

---

## 📖 Modo de uso

1. Mantén pulsada la **tecla de activación** (por defecto `Shift`).
2. Coloca el puntero del ratón sobre cualquier enlace.
3. Tras el tiempo de espera configurado (`200 ms`), aparecerá el panel emergente.
4. Para cerrar la vista previa, suelta la tecla activadora.
5. Si deseas mantener el panel abierto sin presionar la tecla, arrastra la cabecera o pulsa `Espacio`.

---

## ⚙️ Configuración y Ajustes

Haz clic derecho sobre el icono de la extensión y selecciona **Opciones**:

* **Tecla de activación:** `Shift`, `Control`, `Alt` o `Sin tecla (Solo Hover)`.
* **Dimensiones por defecto:** Ancho (`600px`) y Alto (`700px`).
* **Tiempo de espera (Delay):** Retardo en milisegundos (`200ms`) antes de lanzar la vista previa.
* **Lista negra de dominios:** Excluye sitios web específicos escribiendo un dominio por línea.
* **Tema visual:** Alterna entre Modo Oscuro y Modo Claro.

---

## 🛠️ Instalación local (Desarrollo)

> [!IMPORTANT]
> **Configuración del `manifest.json` según el navegador:**
> * **Firefox:** Debe usar `"background": { "scripts": ["src/background/background.js"] }`
> * **Chromium (Chrome / Brave / Edge):** Debe usar `"background": { "service_worker": "src/background/background.js" }`

### En Mozilla Firefox:
1. Asegúrate de tener configurado en `manifest.json` el bloque `"background": { "scripts": [...] }`.
2. Navega a `about:debugging#/setup`.
3. Haz clic en **Este Firefox** (*This Firefox*).
4. Pulsa en **Cargar complemento temporal...** (*Load Temporary Add-on...*).
5. Selecciona el archivo `manifest.json` del proyecto.

### En Chromium (Chrome, Brave, Edge):
1. Asegúrate de tener configurado en `manifest.json` el bloque `"background": { "service_worker": "..." }`.
2. Navega a `chrome://extensions`.
3. Activa el **Modo de desarrollador** (esquina superior derecha).
4. Haz clic en **Cargar descomprimida** (*Load unpacked*).
5. Selecciona la carpeta raíz del proyecto.

> [!TIP]
> **Permiso de ejecución automática en Chromium:**  
> Al instalarla localmente en Chrome/Brave/Edge, el navegador puede restringir la extensión a ejecución "Bajo demanda". Para que funcione siempre de forma automática al pasar el ratón, haz clic secundario en el icono de la extensión -> **"Puede leer y cambiar datos del sitio"** -> Selecciona **"En todos los sitios"**.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.