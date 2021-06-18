import { VirtualElement, VirtualElementOption } from './types';

export function div({
  children,
  style,
  className,
  ...rest
}: VirtualElementOption): VirtualElement {
  return {
    children,
    tagName: 'div',
    style,
    className,
    ...rest,
  } as VirtualElement;
}

export function span({
  children,
  style,
  className,
  ...rest
}: VirtualElementOption): VirtualElement {
  return {
    children,
    tagName: 'span',
    style,
    className,
    ...rest,
  } as VirtualElement;
}

export function h1({
  children,
  style,
  className,
  ...rest
}: VirtualElementOption): VirtualElement {
  return {
    children,
    tagName: 'h1',
    style,
    className,
    ...rest,
  } as VirtualElement;
}

export function createElementFromHTML(htmlString: string) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.firstChild;
}

export function updateDomStyle(
  node: HTMLElement,
  style: Record<string, string>
) {
  Object.keys(style).forEach((styleKey: string) => {
    if (style && style[styleKey]) {
      node.style.setProperty(styleKey, style[styleKey]);
    }
  });
}
