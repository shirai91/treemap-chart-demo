import { VirtualElement } from "./types";

export function render(dom: VirtualElement | string): string {
  let html = "";

  if (typeof dom === "string") {
    return dom;
  }

  // Incase params is a VirtualElement,
  // Render tag then childen

  const { tagName, className, style, children, ...rest } = dom;
  html += `<${tagName}`;
  // Render className
  if (className) {
    html += ` class="${className}"`;
  }

  //Render style
  if (style) {
    html += ` style="`;
    Object.keys(style).forEach((styleKey) => {
      if (style && style[styleKey]) {
        html += `${styleKey}:${style[styleKey]};`;
      }
    });
    html += `"`;
  }

  if (rest) {
    Object.keys(rest).forEach((attribute: string) => {
      if (rest && rest[attribute]) {
        html += ` ${attribute}="${rest[attribute]}"`;
      }
    });
  }

  html += `>`;

  // render children
  if (typeof children === "string") {
    html += render(children);
  }

  if (!Array.isArray(children) && typeof children !== "string") {
    html += render(children as VirtualElement);
  }

  if (Array.isArray(children)) {
    children.forEach((child: VirtualElement) => {
      html += render(child);
    });
  }

  html += `</${dom.tagName}/>`;

  return html;
}
