import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import NavbarDashboard from "@/components/NavbarDashboard";

export const metadata = {
  title: "Produits | PublikMarket",
};

export default async function Produit() {
  const setCookies = await cookies();
  const session = setCookies.get("myapp_session")?.value;
  if (!session) redirect("/");

  const reponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/recupProduitsBoutique?IdBoutiqueVendeur=${session}`,
    {
      cache: "no-store",
    }
  );
  const result = await reponse.json();

  const produits = result.produits;
  

  return (
    <main className="flex-1 p-[30px] min-[1100px]:ml-64">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Produits</h2>
        <NavbarDashboard />
      </div>

      <div className="grid grid-cols-3 max-[600px]:grid-cols-2 gap-3  ">
        {produits.map((produit) => {
          return (
            <Link
              key={produit.id}
              href={`/dashboard/produits/modifierProduit/${produit.id}`}
            >
              <div className="bg-white border border-gray-200 shadow-md relative  w-full max-w-sm overflow-hidden mx-auto mt-4">
                <div className="aspect-3/2 ">
                  <Image src={produit.image} alt={produit.nomProduit} fill />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
