let currentPreview = null;
let hoverTimer = null;
let closeTimer = null;

document.addEventListener('mouseover', (event) => {
    let target = event.target.closest('a');

    // Si el puntero entra en la propia ventana de previsualización, cancelar el cierre
    if (event.target.closest('#link-preview-box')) {
        clearTimeout(closeTimer);
        return;
    }

    // Comprobar si es un enlace válido y no está dentro de la propia previsualización
    if (target && target.href && !target.href.startsWith('javascript:') && !target.href.startsWith('#')) {
        if (target.closest('#link-preview-box')) return;
        if (currentPreview && currentPreview.dataset.targetUrl === target.href) return;

        clearTimeout(hoverTimer);
        clearTimeout(closeTimer);

        hoverTimer = setTimeout(() => {
            removeExistingPreview();

            let previewBox = document.createElement('div');
            previewBox.id = 'link-preview-box';
            previewBox.dataset.targetUrl = target.href;
            
            let leftPos = Math.min(event.clientX + 15, window.innerWidth - 420);
            let topPos = Math.min(event.clientY + 15, window.innerHeight - 320);

            previewBox.style.position = 'fixed';
            previewBox.style.left = `${Math.max(10, leftPos)}px`;
            previewBox.style.top = `${Math.max(10, topPos)}px`;
            previewBox.style.pointerEvents = 'auto';

            let iframe = document.createElement('iframe');
            iframe.src = target.href;
            iframe.width = "400";
            iframe.height = "300";
            iframe.setAttribute('scrolling', 'yes');
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            previewBox.appendChild(iframe);
            document.body.appendChild(previewBox);
            currentPreview = previewBox;

            // Mantener abierto mientras el usuario esté interactuando con la ventana
            previewBox.addEventListener('mouseenter', () => {
                clearTimeout(closeTimer);
            });

            previewBox.addEventListener('mouseleave', () => {
                scheduleClose();
            });

        }, 200);
    }
});

document.addEventListener('mouseout', (event) => {
    let target = event.target.closest('a');
    if (target && !target.closest('#link-preview-box')) {
        clearTimeout(hoverTimer);
        scheduleClose();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        removeExistingPreview();
    }
});

function scheduleClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
        if (currentPreview && !currentPreview.matches(':hover')) {
            removeExistingPreview();
        }
    }, 300); // 300ms de margen para permitir deslizar el cursor hacia el iframe
}

function removeExistingPreview() {
    if (currentPreview) {
        currentPreview.remove();
        currentPreview = null;
    }
}
