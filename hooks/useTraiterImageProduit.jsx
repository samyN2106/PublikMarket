"use client";

import { supabase } from "@/lib/supabase";
import imageCompression from "browser-image-compression";
import { useEffect, useState } from "react";
export function useTraiterImageProduit() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [erreurFile, setErreurFile] = useState(null);

  function sanitizeFileName(fileName) {
    return fileName
      .normalize("NFD") // enlève les accents
      .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
      .replace(/\s+/g, "_") // remplace espaces par _
      .replace(/[^a-zA-Z0-9._-]/g, ""); // garde seulement lettres, chiffres, ., _, -
  }
 
  useEffect(() => {
    const stockerImage = async () => {
      if (file) {
        const options = {
          maxSizeMB: 1, // taille maximale en mégaoctets (ici 1 Mo)
          maxWidthOrHeight: 800, // largeur/hauteur maximale en pixels
          useWebWorker: true, // permet d'utiliser un thread séparé pour éviter que le navigateur "gèle"
        };
        const compressedFile = await imageCompression(file, options);
        const fileName = `${Date.now()}_${compressedFile.name}`;
        const safeName = sanitizeFileName(fileName);

        const { error } = await supabase.storage
          .from("images-produit")
          .upload(safeName, compressedFile);

        if (error) {
          setErreurFile(error);
          return;
        }

        const { data: imageUrl } = supabase.storage
          .from("images-produit")
          .getPublicUrl(safeName);

        setImageUrl(imageUrl.publicUrl);
      }
    };

    stockerImage();
  }, [file]);

  return { setFile, imageUrl, erreurFile };
}
