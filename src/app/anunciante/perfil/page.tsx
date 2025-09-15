import ChangePassword from "@/components/page/perfil/senha";

export default async function Perfil() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-center p-6 w-full max-w-2xl rounded-lg gap-2">
        <h1 className="text-xl md:text-2xl font-[500]">Alterar senha</h1>
        <ChangePassword />
      </div>
    </div>
  );
}
