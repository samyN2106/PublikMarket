"use client";
import NavbarDashboard from "@/components/NavbarDashboard";
import { useEffect, useState } from "react";
import { useTraiterImageProduit } from "@/hooks/useTraiterImageProduit";
import { ActionAddProduit } from "@/app/actions/ActionAddProduit";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AjouterProduit() {
  const { setFile, imageUrl, erreurFile } = useTraiterImageProduit();
  const [nomProduit, setNomProduit] = useState("");
  const [description, setDescription] = useState("");
  const [prixProduit, setPrixProduit] = useState("");
  const [numeroAcontacter, setNumeroAcontacter] = useState("");
  const [pointDeLivraison, setPointDeLivraison] = useState("");
  const [ficher, setFicher] = useState(null);
  const [clicked, setClicked] = useState(false);

  const [pending, setPending] = useState(false);
  const [errorServeur, setErrorServeur] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setFile(ficher);
  }, [ficher]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);
    // try {
    if (imageUrl) {
      setPending(true);
      const reponse = await ActionAddProduit({
        nomProduit,
        description,
        prixProduit,
        numeroAcontacter,
        pointDeLivraison,
        image: imageUrl,
      });

      if (!reponse.success) {
        setErrorServeur(reponse.message);
      }
      if (reponse.success) {
        setPending(false);
        router.push("/dashboard/produits");
      }
    }
  };

  if (erreurFile) {
    console.error("erreurFile:", erreurFile);
    return (
      <main className="flex flex-col p-[30px] w-full justify-center  items-center min-[1100px]:ml-64 ">
        <Image
          src="/message-derreur.png"
          width={100}
          height={100}
          alt="icone erreur"
        />
        <p> Erreur lors du chargement de l'image.........</p>
      </main>
    );
  }

  if (errorServeur)
    return (
      <main className="flex flex-col p-[30px] w-full justify-center  items-center min-[1100px]:ml-64">
        <Image
          src="/message-derreur.png"
          width={100}
          height={100}
          alt="icone erreur"
        />
        <p>{errorServeur}</p>
      </main>
    );

  return (
    <main className="flex flex-col w-full min-[540]:p-[30px] max-[540]:py-[30px] max-[540]:p-2.5 min-[1100px]:ml-64">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Ajouter Produit</h2>
        <NavbarDashboard />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl relative  w-full"
      >
        {/* champs nom produit */}
        <div className=" mb-4">
          <input
            onChange={(e) => setNomProduit(e.target.value)}
            value={nomProduit}
            type="text"
            placeholder="Nom du produit"
            className="w-full border p-2 rounded-lg  outline-0"
          />
          {!nomProduit && clicked && (
            <p className="text-red-500 text-sm mt-1">
              Donnez un nom au produit
            </p>
          )}
        </div>

        {/* champs description produit */}
        <div className=" mb-4">
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Description du produit"
            className="w-full border p-2 rounded-lg  outline-0"
          />
          {!description && clicked && (
            <p className="text-red-500 text-sm mt-1">Description requise</p>
          )}
        </div>

        {/* champs prix produit */}
        <div className=" mb-4">
          <input
            onChange={(e) => setPrixProduit(e.target.value)}
            value={prixProduit}
            type="number"
            placeholder="Prix du produit ex:40.000"
            className="w-full border p-2 rounded-lg  outline-0"
            min="1"
          />
          {!prixProduit && clicked && (
            <p className="text-red-500 text-sm mt-1">Prix requis</p>
          )}
        </div>

        {/* champs numero a contacter */}
        <div className=" mb-4">
          <input
            onChange={(e) => setNumeroAcontacter(e.target.value)}
            value={numeroAcontacter}
            type="text"
            placeholder="Numero a contacter pour le produit"
            className="w-full border p-2 rounded-lg outline-0"
          />
          {!numeroAcontacter && clicked && (
            <p className="text-red-500 text-sm mt-1">
              Numero a contacter requis
            </p>
          )}
        </div>

        {/* champs point de livraison */}
        <div className=" mb-4">
          <input
            onChange={(e) => setPointDeLivraison(e.target.value)}
            value={pointDeLivraison}
            type="text"
            placeholder="point de livraison. Ex: Abidjan,Bouake......"
            className="w-full border p-2 rounded-lg outline-0"
          />
          {!pointDeLivraison && clicked && (
            <p className="text-red-500 text-sm mt-1">
              Point de livraison requis
            </p>
          )}
        </div>

        {/* champs image produit */}
        <div className=" mb-6">
          <input
            onChange={(e) => {
              setFicher(e.target.files?.[0]);
            }}
            accept="image/*"
            type="file"
            className="w-full border p-2 rounded-lg  outline-0"
          />
          {!ficher && clicked && (
            <p className="text-red-500 text-sm mt-1">
              Choisissez une image pour le produit
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`px-4 py-2 font-semibold rounded-lg text-white
    ${
      pending
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#9e86ba] hover:bg-[#9d92a8]"
    }`}
        >
          {pending ? "Chargement..." : "Ajouter le produit"}
        </button>
      </form>
    </main>
  );
}
