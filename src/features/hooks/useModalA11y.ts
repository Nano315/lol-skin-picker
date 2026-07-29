import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface ModalA11yOptions {
  /** When false, Escape does nothing (e.g. a consent modal that forces a choice). Default true. */
  closeOnEscape?: boolean;
}

/**
 * Accessibility wiring shared by every modal/dialog so they all behave the
 * same for keyboard and screen-reader users:
 *   - moves focus into the dialog on open (focuses the container itself so
 *     the dialog is announced via aria-labelledby without ringing a control)
 *   - Tab / Shift+Tab cycle *within* the dialog instead of leaking to the
 *     page behind it (focus trap)
 *   - Escape calls `onClose` (opt-out with `closeOnEscape: false`)
 *   - restores focus to the previously-focused element when the dialog closes
 *
 * Listens on `window` so it catches both key events that bubble up from a
 * focused child and events dispatched directly on `window`.
 *
 * The latest `onClose` is read through a ref, so the focus setup/teardown
 * runs exactly once per open (it never re-focuses on every parent re-render).
 *
 * @param ref     ref to the dialog container element
 * @param onClose dismissal path, invoked on Escape
 */
export function useModalA11y(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  { closeOnEscape = true }: ModalA11yOptions = {}
): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    // Make the container programmatically focusable, then focus it so the
    // dialog (and its aria-labelledby title) is announced on open.
    if (node.getAttribute("tabindex") === null) node.tabIndex = -1;
    node.focus({ preventScroll: true });

    const getFocusable = (): HTMLElement[] =>
      Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.tabIndex !== -1 && !el.hasAttribute("disabled"));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (closeOnEscape) {
          e.stopPropagation();
          onCloseRef.current();
        }
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        node.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === node || !node.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !node.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [ref, closeOnEscape]);
}
