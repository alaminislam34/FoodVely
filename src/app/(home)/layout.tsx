import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="h-full">{children}</section>
      </main>
      <Footer />
    </div>
  );
}
