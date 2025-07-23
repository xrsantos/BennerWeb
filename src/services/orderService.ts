
import type { FormaPagamento, StatusPedido } from '../types/Pedido';
import { toPedidoItemDto, type PedidoItem, type PedidoItemDto } from '../types/PedidoItem';
import { http } from './http';

export const orderService = {
  save(pessoa?: number, itens?: PedidoItem, formapagamento?: FormaPagamento ) {
    const itensDto: PedidoItemDto[] = itens.map(toPedidoItemDto);
    return http.post<boolean>('/Pedido', {PessoaId: pessoa, Itens: itensDto, formapagamento} ).then(r => r.data);
  },

  updateStatus(id: number, status: StatusPedido) {
    
    
    let idstatus = 1;

    if (status == 'Pendente' )
    {
        idstatus = 0;
    }

    if (status == 'Pago' )
    {
        idstatus = 3;
    }

    if (status == 'Enviado' )
    {
        idstatus = 6;
    }

    if (status == 'Recebido' )
    {
        idstatus = 9;
    }

    return http.patch<boolean>("/Pedido/$"+id+"/status?status="+idstatus ).then(r => r.data);
  },


};