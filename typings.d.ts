declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.webp';
declare module '*.svg' {
  // eslint-disable-next-line no-undef
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}
