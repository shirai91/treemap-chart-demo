interface IVirtualelement {
  [key: string]:
    | string
    | Record<string, string>
    | VirtualElement
    | VirtualElement[];
}

export type VirtualElementOption = IVirtualelement & {
  children?: VirtualElement | VirtualElement[] | string;
  style?: Record<string, string>;
  className?: string;
  id?: string;
  tabIndex?: string;
  title?: string;
};

export type VirtualElement = VirtualElementOption & {
  tagName: string;
};
