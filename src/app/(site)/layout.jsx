import NavbarAuth from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <NavbarAuth />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
