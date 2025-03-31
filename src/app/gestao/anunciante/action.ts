"use server";

const DATA = [
    {id: 1, name: "Anúncio 1", status: "ativo", vencimento: "2025-10-01"},
    {id: 2, name: "Anúncio 2", status: "pendente", vencimento: "2025-11-01"},
    {id: 3, name: "Anúncio 3", status: "ativo", vencimento: "2025-12-01"},
    {id: 4, name: "Anúncio 4", status: "recusado", vencimento: "2025-10-15"},
    {id: 5, name: "Anúncio 5", status: "ativo", vencimento: "2025-11-15"},
]

export  async function SearchCPF(data: FormData) {
  await new Promise((res) => setTimeout(res, 2000));

  if (data.get("cpf") === "038.770.582-13") {
    return { success: true, message: "CPF encontrado", data: DATA };
  }
  return { success: false, message: "CPF não encontrado" };
}

export  async function SendEmail(data: FormData) {
    await new Promise((res) => setTimeout(res, 2000));
    
    if (data.get("email") === "michaelhrqfs@gmail.com") {
      return { success: true, message: "Convite enviado" };
    }
    return { success: false, message: "Erro ao enviar convite" };
  }
