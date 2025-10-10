export default function Diretrizes() {
  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="flex flex-col bg-[#1E1E1E] items-start p-6 w-full max-w-2xl rounded-lg gap-6 text-neutral-300">
        <h1 className="text-xl md:text-2xl font-[500] text-white mb-2 self-center">
          Diretrizes de Publicação
        </h1>

        <section className="w-full space-y-2">
          <h2 className="text-lg font-semibold text-white">
            📌 Regras de publicação
          </h2>
          <p>
            Podemos recusar, sem aviso prévio, qualquer material que julgarmos
            de mal gosto.
          </p>
        </section>

        <section className="w-full space-y-2">
          <h2 className="text-lg font-semibold text-green-500">
            ✅ Conteúdo permitido
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Material da própria anunciante, com boa qualidade e nitidez.
            </li>
            <li>
              Que represente a profissional de forma elegante, respeitosa e
              verdadeira.
            </li>
            <li>Respeitando as leis brasileiras e as políticas da plataforma.</li>
          </ul>
        </section>

        <section className="w-full space-y-2">
          <h2 className="text-lg font-semibold text-red-500">
            ❌ Conteúdo proibido
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Que possua a presença de outras pessoas, mesmo que parcialmente visíveis.</li>
            <li>Infantilização, como uso de fantasias, acessórios ou linguagem que remetam à infância.</li>
            <li>Fantasias ou representações que desrespeitem religiões, profissões, instituições ou animais.</li>
            <li>Incitação a violência, apologia ao crime, discurso de ódio ou discriminação.</li>
            <li>Com marcas d&#39;água, logos de outros sites, contatos visíveis ou edições que deturpem a imagem original.</li>
          </ul>
        </section>

        <section className="w-full space-y-2">
          <h2 className="text-lg font-semibold text-yellow-500">
            ⚠️ Observações Importantes
          </h2>
          <p>A reincidência pode levar à suspensão ou exclusão do perfil.</p>
        </section>
      </div>
    </div>
  );
}
