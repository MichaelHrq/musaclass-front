export interface MediaProps {
  tipo: string;
  url: string;
}

export interface Postagem {
  id: string;
  anunciante: string;
  data: string;
  hora: string;
  midia: MediaProps;
  legenda: string;
  status: string;
}
