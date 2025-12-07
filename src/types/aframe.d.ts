declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        embedded?: boolean;
        'vr-mode-ui'?: string;
    }, HTMLElement>;
    'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'gltf-model'?: string;
        position?: string;
        scale?: string;
    }, HTMLElement>;
    'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'gps-new-camera'?: string;
    }, HTMLElement>;
  }
}
