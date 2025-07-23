export interface Person {
    id: number
    nome: string
    cpf: string
    endereco?: string | null
  }

  export interface PersonCreateDto {
    id: number
    nome: string
    cpf: string
    endereco?: string | null
  }
