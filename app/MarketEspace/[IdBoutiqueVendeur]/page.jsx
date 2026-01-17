"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeaderProduits from "@/components/HeaderProduits";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useGestionSearchProduit } from "@/hooks/useGestionSearchProduit";

export default function EspaceVente() {
  const { IdBoutiqueVendeur } = useParams();
  const [firstProduitBoutique, setFirstProduitBoutique] = useState(null);

  const haveMore = useRef(null);

  const {
    handleSearch,
    produits,
    produitsSearch,
    setPage,
    chargerment,
    query,
  } = useGestionSearchProduit();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!query) {
          setPage((p) => p + 1);
        } else {
          setPageSearch((p) => p + 1);
        }
      }
    });

    if (haveMore.current) observer.observe(haveMore.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchProduitsBoutique() {
      const reponse = await fetch(
        `/api/recupUniqueProduitsBoutique?IdBoutiqueVendeur=${IdBoutiqueVendeur}`
      );
      const result = await reponse.json();
      if (!reponse.ok) {
        return notFound();
      }
      setFirstProduitBoutique(result.produit);
    }
    fetchProduitsBoutique();
  }, []);

  if (produits)
    return (
      <>
        <HeaderProduits onSearch={handleSearch} />

        <div className="mb-[30px]">
          <h1 className="text-6xl max-[430px]:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-500 text-center py-6 drop-shadow-lg">
            {firstProduitBoutique
              ? `Bienvenue chez ${firstProduitBoutique.boutique.name}`
              : ""}
          </h1>
        </div>

        <article className="max-w-[1400px]  mx-auto  max-[600px]:mx-[5px]   grid grid-cols-4 max-[1000px]:grid-cols-3 max-[600px]:grid-cols-2  gap-3   ">
          {(query ? produitsSearch : produits).map((pd) => {
            if (pd.boutiqueId == IdBoutiqueVendeur) {
              return (
                <Link
                  key={pd.id}
                  href={`/MarketEspace/${pd.boutiqueId}/${pd.id}`}
                >
                  <div className="bg-white border border-gray-200 shadow-md relative  w-full max-w-sm overflow-hidden mx-auto mt-4">
                    <span className="absolute bg-white right-0 top-0  z-10 font-bold text-full text-red-600">
                      <p className="px-[5px]">{pd.price} FCFA</p>
                    </span>
                    <div className="aspect-[3/2] ">
                      <Image src={pd.image} alt={pd.nomProduit} fill />
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </article>
        {chargerment ? (
          <div
            ref={haveMore}
            className="text-center
      "
          >
            chargement ...........
          </div>
        ) : (
          ""
        )}
      </>
    );
}
