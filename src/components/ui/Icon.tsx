import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

export interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  // Convert kebab-case to PascalCase
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const LucideIcon = (LucideIcons as any)[pascalName];
  if (!LucideIcon) {
    console.warn(`Icon ${name} (${pascalName}) not found in lucide-react`);
    return <div className="w-5 h-5 bg-[var(--surface-skeleton)] rounded" />;
  }
  return <LucideIcon {...props} />;
}
