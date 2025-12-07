declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'poster'?: string;
        'shadow-intensity'?: string;
        'environment-image'?: string;
        style?: React.CSSProperties;
      },
      HTMLElement
    >;
  }
}
