# 🔗 Web Link Previewer

> Una extensión ligera para **Mozilla Firefox** que permite previsualizar cualquier enlace, imagen o vídeo en un panel flotante interactivo antes de entrar en él.

---

## 🚀 Características principales

* **Ventana flotante interactiva:** Navega o lee el contenido de la web de destino directamente desde el panel emergente sin salir de la pestaña actual.
* **Mover y redimensionar:** Arrastra el panel desde la barra superior para colocarlo donde quieras o cambia sus dimensiones arrastrando las esquinas.
* **Fijar vista previa (Pin):** Congela el panel para mantenerlo abierto e interactuar con él.
* **Formatos multimedia automáticos:** Detecta enlaces directos a imágenes (`.png`, `.jpg`, `.webp`) y vídeos (`.mp4`, `.webm`) para reproducirlos al instante.
* **Integración con YouTube:** Convierte automáticamente los enlaces de YouTube a reproductores limpios (*embed*).
* **Indicador de carga animado:** Muestra una barra de progreso sutil bajo el puntero del ratón mientras se procesa el enlace.
* **Filtro de dominios:** Permite definir una lista negra de sitios donde no deseas que se active la previsualización.
* **Modo Oscuro por defecto:** Interfaz de ajustes estilizada y adaptable.

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
4. Para cerrar la vista previa, simplemente **suelta la tecla activadora**.
5. Si deseas mantener el panel abierto sin presionar la tecla, arrastra la cabecera o pulsa `Espacio`.

> [!NOTE]
> **Aviso de seguridad (*X-Frame-Options*):**  
> Algunos sitios web (como Google, X/Twitter o entidades bancarias) bloquean su carga dentro de cuadros emergentes mediante cabeceras de seguridad del propio servidor. Si el sitio lo bloquea, el panel mostrará un aviso informando que debe abrirse en una pestaña nueva.

---

## ⚙️ Configuración y Ajustes

Puedes personalizar el comportamiento de la extensión haciendo clic derecho sobre su icono en Firefox y seleccionando **Opciones**:

* **Tecla de activación:** `Shift`, `Control`, `Alt` o `Sin tecla (Solo Hover)`.
* **Dimensiones por defecto:** Ancho (`600px`) y Alto (`700px`).
* **Tiempo de espera (Delay):** Retardo en milisegundos (`200ms`) antes de lanzar la vista previa.
* **Lista negra de dominios:** Excluye sitios web específicos escribiendo un dominio por línea.
* **Tema visual:** Alterna entre Modo Oscuro y Modo Claro.

---

## 🛠️ Instalación local (Desarrollo)

1. Clona o descarga este repositorio en tu equipo.
2. Abre Firefox y navega a `about:debugging#/setup`.
3. Haz clic en **Este Firefox** (*This Firefox*).
4. Pulsa en **Cargar complemento temporal...** (*Load Temporary Add-on...*).
5. Selecciona el archivo `manifest.json` del proyecto.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.