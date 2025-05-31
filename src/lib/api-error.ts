// A classe ApiError permanece a mesma, é uma boa definição.
export class ApiError extends Error {
  public data?: any; // Opcional: para carregar dados do erro da API
  constructor(public status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError"; // Melhor para identificar o tipo de erro
    this.data = data;
  }
}