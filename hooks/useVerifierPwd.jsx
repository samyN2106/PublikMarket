import { useEffect, useState } from "react";

export default function useVerifierPwd() {
  const [valeurPwd, setValuePwd] = useState(null);
  const [niveauPwd, setNiveauPwd] = useState(null);

  useEffect(() => {
    setNiveauPwd(verifyPassword(valeurPwd));
  }, [valeurPwd]);

  useEffect(() => {
    getBarColor();
  }, [niveauPwd]);

  function verifyPassword(value) {
    if (value) {
      // Tests de complexité avec regex
      const hasLower = /[a-z]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[@$!%*?&]/.test(value);
      const minLength = value.length >= 8;

      let score = 0;
      if (hasLower) score++;
      if (hasUpper) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;
      if (minLength) score++;

      if (value.length === 0) {
        return "";
      }
      if (score <= 3) {
        return "Faible";
      }
      if (score <= 4) {
        return "Moyen";
      }
      if (score == 5) {
        return "Fort";
      }
    }
  }

  const getBarColor = () => {
    switch (niveauPwd) {
      case "Faible":
        return "bg-red-500 w-1/3 h-[4px]";
      case "Moyen":
        return "bg-yellow-500 w-2/3 h-[4px]";
      case "Fort":
        return "bg-green-500 w-full h-[4px]";
      default:
        return "bg-gray-200 w-0";
    }
  };

  return { setValuePwd, niveauPwd, getBarColor };
}
