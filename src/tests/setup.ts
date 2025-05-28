import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do window.URL.createObjectURL
window.URL.createObjectURL = vi.fn();

// Mock do document.createElement
const originalCreateElement = document.createElement;
document.createElement = function(tagName: string) {
  const element = originalCreateElement.call(document, tagName);
  if (tagName === 'a') {
    element.click = vi.fn();
  }
  return element;
}; 