import { DNABackground } from "@/components/shared/DNABackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <DNABackground />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
