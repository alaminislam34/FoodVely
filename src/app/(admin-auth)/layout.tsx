export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <main>
        <section className="h-full">{children}</section>
      </main>
    </div>
  );
}
