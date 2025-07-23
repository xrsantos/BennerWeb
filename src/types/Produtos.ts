export interface Produto {
    id: number
    nome: string
    codigo: string
    valor: number 
  }

export interface ProdutoCreateDto {
    id: number
    nome: string
    codigo: string
    valor: number
  }


export interface ProdutoFilterDto {
    nome: string
    codigo: string
    valormin: number
    valormax: number
  }