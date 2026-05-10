import Image from 'next/image'

// Composant Header avec une variante
export function Header({ variante = "normal" }) {
  return (
    <header className={"flex justify-center w-full"}>
      <Image
        src="/logo-cesizen.png"
        alt="Logo CESIZen"
        width={variante === "accueil" ? 100 : 80}
        height={variante === "accueil" ? 100 : 80}
        priority
      />
    </header>
  )
}