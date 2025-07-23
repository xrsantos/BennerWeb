import type { Produto } from "./Produtos";

export interface PedidoItem {
  tempId: string;
  produto: Produto;
  quantidade: number;
  precoUnitario: number;
}


export interface PedidoItemDto {
  ProdutoId: Number;
  Quantidade: number;
}


export const toPedidoItemDto = (item: PedidoItem): PedidoItemDto => ({
  ProdutoId: item.produto.id,
  Quantidade: item.quantidade
});