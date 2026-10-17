/** Exact three-dot treatment from the exported design system's Button component. */
export function LoadingDots({ label = "Loading" }: { label?: string }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-flex items-center gap-[5px]"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          aria-hidden="true"
          className="tb-loading-dot"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
}
