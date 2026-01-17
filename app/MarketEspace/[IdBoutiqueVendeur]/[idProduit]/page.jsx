import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { idProduit } = await params;

  const reponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/produit/${idProduit}`,
    {
      cache: "no-store",
    }
  );
  const result = await reponse.json();

  const produit = result.produit;

  return {
    title: `${produit.nomProduit} | PublikMarket`,
    description: `Achetez ${produit.nomProduit} au meilleur prix sur PublikMarket.`,
  };
}

export default async function Espaceproduit({ params }) {
  const { idProduit } = await params;

  const reponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/produit/${idProduit}`,
    {
      cache: "no-store",
    }
  );
  const result = await reponse.json();
  if (!reponse.ok) notFound();
  const produit = result.produit;

  return (
    <>
      <header>
        <h1 className="ml-[10px] text-3xl max-[430px]:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-500  py-6 drop-shadow-lg">
          Espace {produit.boutique.name}
        </h1>
      </header>

      <main className="max-w-[1200px] min-[760px]:mx-auto mt-[30px]">
        <section>
          <h2 className="text-center text-[30px] font-bold mb-[30px]">
            {produit.nomProduit}
          </h2>
          {
            <div className="flex max-[760px]:flex-col items-center max-[1300px]:mx-[50px] max-[900px]:mx-[20px]">
              <div className="w-[50%] max-[760px]:w-full mb-[20px] min-[760px]:h-[450px] max-[760px]:h-[350px] min-[760px]:mr-[30px] relative">
                <span className="absolute bg-white right-0 top-0 px-[15px] z-10 font-bold text-xl text-red-600">
                  {produit.price} FCFA
                </span>
                <Image fill src={produit.image} alt={produit.nomProduit} />
              </div>
              <div className="w-[50%] max-[760px]:w-full text-2xl flex flex-col max-[760px]:flex-col-reverse justify-center gap-[50px]">
                <div>
                  <a
                    href={`tel:${produit.numAContacter}`}
                    className=" text-red-500"
                  >
                    <strong
                      className="text-black"
                      style={{ textDecoration: "underline" }}
                    >
                      Numero(s) a contacter
                    </strong>
                    : {produit.numAContacter}
                  </a>
                  <p className="mt-[20px]">
                    <strong style={{ textDecoration: "underline" }}>
                      Point(s) de livraison
                    </strong>
                    : {produit.pointLivraison}
                  </p>
                </div>
                <p className=" font-black ">
                  Contactez le vendeur pour echanger par rapport a ce produit
                </p>

                <div>
                  <strong style={{ textDecoration: "underline" }}>
                    Description
                  </strong>

                  <p className="text-xl">{produit.description}</p>
                </div>
              </div>
            </div>
          }
        </section>
      </main>
    </>
  );
}
