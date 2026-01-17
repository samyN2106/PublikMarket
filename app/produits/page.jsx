"use client";

import Link from "next/link";
import Image from "next/image";
import HeaderProduits from "@/components/HeaderProduits";
import { useEffect, useRef } from "react";
import { useGestionSearchProduit } from "@/hooks/useGestionSearchProduit";

export default function Produit() {
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

  return (
    <>
      <HeaderProduits onSearch={handleSearch} />
      <article className="max-w-350  mx-auto max-[600px]:mx-1.25  grid grid-cols-4 max-[1000px]:grid-cols-3 max-[600px]:grid-cols-2  gap-3 ">
        {(query ? produitsSearch : produits).map((pd) => {
          return (
            <Link key={pd.id} href={`/produits/${pd.id}`}>
              <div className="bg-white border border-gray-200 shadow-md relative shrink-0   w-full max-w-sm h-auto overflow-hidden mx-auto ">
                <div className="absolute bg-white right-0 top-0  z-10 font-bold min-[1000px]:text-xl text-red-600">
                  <p className="px-[10px]">{pd.price} FCFA</p>
                </div>
                <div className="aspect-3/2">
                  <Image src={pd.image} alt={pd.nomProduit} fill />
                </div>
              </div>
            </Link>
          );
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
