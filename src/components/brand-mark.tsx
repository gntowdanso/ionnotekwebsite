type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className, title = "Ionnotek" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <rect x="3" y="3" width="66" height="66" rx="16" fill="#F7FCFF" stroke="#2E6670" strokeWidth="3" />
      <path
        d="M32.4 17.5H46.2L42.8 28.4H50.7L47.7 37.4H40L35.4 55.5H23.3L28.3 37.4H22.5L25.4 28.4H30.8L32.4 17.5Z"
        fill="#1487D4"
      />
      <path
        d="M42.8 13.5C44.4 13.5 45.7 14.8 45.7 16.4C45.7 17.9 44.4 19.3 42.8 19.3C41.2 19.3 39.9 17.9 39.9 16.4C39.9 14.8 41.2 13.5 42.8 13.5Z"
        fill="#1487D4"
      />
      <path d="M32.4 17.5H46.2L44.9 21.8H31.5L32.4 17.5Z" fill="#66B4EB" />
    </svg>
  );
}
