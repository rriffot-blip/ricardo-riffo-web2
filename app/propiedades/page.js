import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingClient from "@/components/ListingClient";
import { getProperties } from "@/lib/properties";

export const metadata = {
  title: "Propiedades disponibles — Ricardo Riffo Propiedades",
};

export const dynamic = "force-dynamic";

export default async function PropiedadesPage() {
  const properties = await getProperties();

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="listheader">
          <h1>Propiedades disponibles</h1>
          <p>Actualizado por Ricardo esta semana. Filtra por comuna, tipo u operación.</p>
        </div>
        <ListingClient properties={properties} />
      </main>
      <Footer />
    </>
  );
}
