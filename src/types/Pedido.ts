import type { PedidoItem } from "./PedidoItem";


export type FormaPagamento = 1 | 3 | 6;   // agora o tipo reflete o enum

/** Map para rótulos legíveis na UI */
export const formaPagamentoLabel: Record<FormaPagamento, string> = {
  1: 'Dinheiro',
  3: 'Cartão',
  6: 'Boleto'
};

export const formaPagamentoOptions: FormaPagamento[] = [1, 3, 6] as const;


export interface Order {
  pessoaId: number;
  itens: PedidoItem[];
  valorTotal: number;
  dataVenda: string;
  formaPagamento: FormaPagamento;
  status: StatusPedido;
}


export type StatusPedido   = 'Pendente' | 'Pago' | 'Enviado' | 'Recebido';

export interface OrderCreateDto {
  pessoaId: number;
  itens: PedidoItem[];
  formaPagamento: FormaPagamento;
}





