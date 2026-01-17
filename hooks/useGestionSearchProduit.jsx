"use client";
import { useState, useEffect } from "react";
export function useGestionSearchProduit() {
  const [produits, setProduits] = useState([]);
  const [produitsSearch, setProduitsSearch] = useState([]);
  const [query, setQuery] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSearch, setPageSearch] = useState(null);
  const [chargerment, setChargement] = useState(true);

  //  recuperer les produits lorsque la page change
  useEffect(() => {
    async function recupProduits() {
      const res = await fetch(`/api/recupAllProduits?page=${page}&limit=5`);
      const rep = await res.json();
      if (res.ok) {
        setProduits((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const nouveaux = (rep.produits ?? []).filter((p) => !ids.has(p.id));
          return [...prev, ...nouveaux];
        });
        if (page >= rep.totalPages) {
          setChargement(false);
        }
      }
    }
    recupProduits();
  }, [page]);

  // recuperer les produits lorsque la recherche change
  useEffect(() => {
    if (!query) return;

    async function search() {
      const res = await fetch(
        `/api/recupProduitsSearch?q=${query}&page=${pageSearch}&limit=5`
      );
      const rep = await res.json();
      if (res.ok) {
        setProduitsSearch([...rep.produits]);

        if (pageSearch >= rep.totalPages) {
          setChargement(false);
        }
      }
    }
    search();
  }, [query, pageSearch]);

  function handleSearch(q) {
    setProduitsSearch([]);
    setPageSearch(1);
    setQuery(q);
    setChargement(true);
  }

  // reerecuperer les produits lorsque la page change et qu'il n'ya pas de recherche
  useEffect(() => {
    if (query) return; // si recherche active, ne pas charger AllProduits
    async function recupProduits() {
      const res = await fetch(`/api/recupAllProduits?page=${page}&limit=5`);
      const rep = await res.json();
      if (res.ok) {
        setProduits((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const nouveaux = (rep.produits ?? []).filter((p) => !ids.has(p.id));
          return [...prev, ...nouveaux];
        });
      }
      if (page >= rep.totalPages) {
        setChargement(false);
      }
    }
    recupProduits();
  }, [page, query]);

  return {
    handleSearch,
    produits,
    produitsSearch,
    setPage,
    chargerment,
    query,
  };
}
