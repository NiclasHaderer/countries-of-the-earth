import { useGlobalEvent } from "./global-events";

const TAB_SELECTORS = 'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

const getTabbableElements = (element: HTMLElement) => [...element.querySelectorAll(TAB_SELECTORS)] as HTMLElement[];
const getFocusedIndexElement = (elements: HTMLElement[]) => elements.findIndex(e => e === document.activeElement);

const toNextTab = (elements: HTMLElement[], currentIndex: number) => {
  let newIndex = currentIndex + 1;
  if (elements.length <= newIndex) newIndex = 0;
  elements[newIndex]?.focus();
};
const toPreviousTab = (elements: HTMLElement[], currentIndex: number) => {
  let newIndex = currentIndex - 1;
  if (newIndex < 0) newIndex = elements.length - 1;
  elements[newIndex]?.focus();
};

export const useFocusTrap = (
  element: HTMLElement | null,
  escapeTrap: (event: KeyboardEvent) => boolean = () => false
) => {
  useGlobalEvent(
    "keydown",
    e => {
      if (!element) return;

      e.preventDefault();
      const tabElements = getTabbableElements(element);

      const currentTabIndex = getFocusedIndexElement(tabElements);

      // Invalid
      if (currentTabIndex === -1 || currentTabIndex >= tabElements.length) tabElements[0]?.focus();

      const goBack = e.shiftKey;
      if (goBack) {
        toPreviousTab(tabElements, currentTabIndex);
      } else {
        toNextTab(tabElements, currentTabIndex);
      }
    },
    e => e.key.toLowerCase() === "tab" && !escapeTrap(e)
  );
};

export const useTabModifier = () => {
  if (typeof window === "undefined") {
    return {
      focusPrevious: () => void 0,
      focusNext: () => void 0,
    };
  }
  const nextEvent = new KeyboardEvent("keydown", {
    key: "Tab",
  });
  const previousEvent = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey: true,
  });

  return {
    focusPrevious: () => window.dispatchEvent(previousEvent),
    focusNext: () => window.dispatchEvent(nextEvent),
  };
};
