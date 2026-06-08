function SimulateMouseClick(targetElement) {
    if (targetElement instanceof HTMLElement) targetElement.focus();
    const boundingRect = targetElement.getBoundingClientRect();
    const clientX = Math.random() * boundingRect.width + boundingRect.left;
    const clientY = Math.random() * boundingRect.height + boundingRect.top;
    const screenX = Math.random() * window.screen.width;
    const screenY = Math.random() * window.screen.height;

    const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: clientX,
        clientY: clientY,
        screenX: screenX,
        screenY: screenY
    });

    targetElement.dispatchEvent(clickEvent);
}

function clickCheckBox() {
    // Try to find the Turnstile widget container
    const turnstileWidget = document.querySelector('div[data-sitekey], iframe[src*="turnstile"]');
    
    if (!turnstileWidget) {
        console.warn("Turnstile widget not found");
        return;
    }

    // Use interval for more reliable detection
    let checkBoxInterval = setInterval(function () {
        const shadowRoot = turnstileWidget.shadowRoot;
        
        if (shadowRoot) {
            const checkBox = shadowRoot.querySelector("input[type=checkbox]");
            
            if (checkBox) {
                setTimeout(function () {
                    const label = shadowRoot.querySelector("label");
                    if (label) {
                        SimulateMouseClick(label);
                    }
                }, 1000);
                clearInterval(checkBoxInterval);
            }
        }
    }, 500); // More frequent check
}

if (document?.documentElement) {
    clickCheckBox();
} else {
    let elementSet = false;
    const observer = new MutationObserver(function () {
        if (!elementSet && document.head) {
            elementSet = true;
            clickCheckBox();
            observer.disconnect();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
}
