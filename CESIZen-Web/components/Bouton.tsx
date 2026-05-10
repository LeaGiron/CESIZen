type BoutonProps = {
  label: string;
  onClick?: () => void;
  taille?: "normal" | "petit";
};

export function Bouton({ label, onClick, taille = "normal" }: BoutonProps) {
  return (
    <button
      onClick={onClick}
      className={
        taille === "petit"
          ? "w-24 h-8 text-sm bg-green-200 rounded-lg font-medium text-black w-full"
          : "w-80 h-10 bg-green-200 rounded-lg font-medium text-black w-full"
      }
    >
      {label}
    </button>
  );
}