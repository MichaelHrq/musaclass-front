export type AnuncioWPType = {
  id: number;
  nome: string;
  url: boolean;
  vencimento: string;
  status: string;
  imgcapa:string
  cidade:string
};

export type SearchCPFGetType = {
  profile?: {
    email:string
  }
  anuncios: AnuncioWPType[]
}