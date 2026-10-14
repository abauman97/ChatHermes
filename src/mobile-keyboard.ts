export function watchMobileKeyboardSpacing(root: HTMLElement, win: Window = window): () => void {
  const viewport = win.visualViewport;
  if (!viewport) {
    root.classList.remove("keyboard-visible");
    return () => {};
  }

  const update = () => {
    const active = win.document.activeElement;
    const editable =
      active?.tagName === "TEXTAREA" ||
      (active?.tagName === "INPUT" &&
        !["button", "checkbox", "file", "submit"].includes((active as HTMLInputElement).type)) ||
      (active instanceof HTMLElement && active.isContentEditable);
    const keyboardOpen =
      win.innerWidth <= 700 &&
      editable &&
      win.innerHeight - viewport.height > 150 &&
      viewport.height < win.innerHeight * 0.8;
    root.classList.toggle("keyboard-visible", keyboardOpen);
  };
  viewport.addEventListener("resize", update);
  win.addEventListener("resize", update);
  win.addEventListener("orientationchange", update);
  win.document.addEventListener("focusin", update);
  win.document.addEventListener("focusout", update);
  update();
  return () => {
    viewport.removeEventListener("resize", update);
    win.removeEventListener("resize", update);
    win.removeEventListener("orientationchange", update);
    win.document.removeEventListener("focusin", update);
    win.document.removeEventListener("focusout", update);
    root.classList.remove("keyboard-visible");
  };
}
