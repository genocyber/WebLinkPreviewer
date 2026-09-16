let currentPreview = null;
let hoverTimer = null;

document.addEventListener('mouseover', (event) => {
    let target = event.target.closest('a');

    // Comprobar si es un enlace válido
    if (target && target.href && !target.href.startsWith('javascript:') && !target.href.startsWith('#')) {
        if (currentPreview && currentPreview.dataset.targetUrl === target.href) return;

        clearTimeout(hoverTimer);

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

            // Creación segura del iframe sin usar innerHTML
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

            previewBox.addEventListener('mouseleave', () => {
                removeExistingPreview();
            });

        }, 200);
    }
});

document.addEventListener('mouseout', (event) => {
    let target = event.target.closest('a');
    if (target) {
        clearTimeout(hoverTimer);
        setTimeout(() => {
            if (currentPreview && !currentPreview.matches(':hover')) {
                removeExistingPreview();
            }
        }, 100);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        removeExistingPreview();
    }
});

function removeExistingPreview() {
    if (currentPreview) {
        currentPreview.remove();
        currentPreview = null;
    }
}