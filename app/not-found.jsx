"use client";
import { useRouter } from "next/navigation";
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex  flex-col gap-2.5 justify-center items-center h-screen">
      <h2 className="text-3xl">404 Not Found </h2>
      <p>Could not find requested resource</p>
      <button
        className="bg-[#9e86ba] inline-block  text-white font-black py-[12px] px-[15px] block text-[17px] rounded-[50px] text-center hover:bg-[#857c8d] transition-colors duration-300"
        onClick={() => router.back()}
      >
        Retour
      </button>
    </div>
  );
}
