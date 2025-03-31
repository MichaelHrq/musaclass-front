import { AnuncioType } from "@/app/gestao/anunciante/page";

export default function ListAnuncios({ item }: { item: AnuncioType }) {
  return (
    <div
      key={item.id}
      className="flex flex-col w-full mt-4 p-4 border-1 border-[#444] rounded-lg bg-[#2A2A2A]"
    >
      <p className="text-xl font-medium">{item.name}</p>
      <p>Status: {item.status}</p>
      <p>Vencimento: {item.vencimento}</p>
    </div>
  );
}
