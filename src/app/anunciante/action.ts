export default async function getAnunciosAction() {
  await new Promise((res) => setTimeout(res, 1000));

  const DATA = [
    { id: 1, name: "Anúncio 1", status: "ativo", vencimento: "2025-10-01" },
    { id: 2, name: "Anúncio 2", status: "pendente", vencimento: "2025-11-01" },
    { id: 3, name: "Anúncio 3", status: "ativo", vencimento: "2025-12-01" },
    { id: 4, name: "Anúncio 4", status: "recusado", vencimento: "2025-10-15" },
    { id: 5, name: "Anúncio 5", status: "ativo", vencimento: "2025-11-15" },
  ];

  return DATA;
}
