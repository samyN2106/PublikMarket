export default function Button({ href, children }) {
  return (
    <a
      href={href}
      className="bg-[#9e86ba] inline-block  text-white font-black py-[12px] px-[15px] block text-[17px] rounded-[50px] text-center hover:bg-[#857c8d] transition-colors duration-300"
    >
      {children}
    </a>
  );
}
