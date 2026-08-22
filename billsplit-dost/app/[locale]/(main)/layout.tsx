import { BottomNav } from "@/components/shared/bottom-nav";
import { AuthGuard } from "@/components/shared/auth-guard";

/**
 * Authenticated shell: max-width phone frame + bottom navigation.
 */
export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <AuthGuard>
      <div className="mx-auto min-h-screen w-full max-w-[430px] pb-24">
        {children}
        <BottomNav locale={locale} />
      </div>
    </AuthGuard>
  );
}
