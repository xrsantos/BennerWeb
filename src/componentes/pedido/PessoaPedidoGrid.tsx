import { CheckCircle, LocalAtm, LocalShipping } from "@mui/icons-material";
import { Chip, Box, CircularProgress, Snackbar } from "@mui/material";
import { type GridColDef, GridActionsCellItem, DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import type { StatusPedido } from "../../types/Pedido";
import { personService } from "../../services/personService";
import { orderService } from "../../services/orderService";


export interface PedidoResumo {
  id: number;
  dataVenda: string;       // ISO date
  valorTotal: number;
  formaPagamento: string;  // 'Dinheiro' | 'Cartao' | 'Boleto'
  status: StatusPedido;
}

/* -----------------------------------------------------------
 * Componente
 * --------------------------------------------------------- */
interface Props {
  personId: number;                  // pessoa selecionada
  onStatusChanged?: () => void;      // callback opcional
}

export const PessoaPedidoGrid: React.FC<Props> = ({
  personId,
  onStatusChanged
}) => {
  const [rows,    setRows]    = useState<PedidoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [snack,   setSnack]   = useState<string>();

  /* ------- load pedidos quando personId muda ------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data  = await personService.pedidos(personId);
        setRows(data);
      } catch {
        setSnack('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    })();
  }, [personId]);

  /* ------- chama API p/ mudar status e atualiza grid -------- */
  const changeStatus = async (id: number, novoStatus: StatusPedido) => {
    try {
      await orderService.updateStatus(id, novoStatus);
      setRows(prev =>
        prev.map(p => (p.id === id ? { ...p, status: novoStatus } : p))
      );
      setSnack('Status atualizado!');
      onStatusChanged?.();
    } catch {
      setSnack('Falha ao atualizar status');
    }
  };

  /* ------- Colunas DataGrid -------- */
  const statusChip = (s: StatusPedido) => {
    switch (s) {
      case "Pago":     return <Chip label="Pago"     color="success" size="small" />;
      case "Enviado":  return <Chip label="Enviado"  color="info"    size="small" />;
      case "Recebido": return <Chip label="Recebido" color="primary" size="small" />;
      default:                    return <Chip label="Pendente" color="warning" size="small" />;
    }
  };

  const columns: GridColDef[] = [
    { field: 'id',          headerName: 'ID',         width: 80 },
    { field: 'dataVenda',   headerName: 'Data',       width: 140},
    { field: 'valorTotal',  headerName: 'Total (R$)', width: 130, type: 'number'},
    { field: 'formaPagamento', headerName: 'Pagamento', width: 120 },
    { field: 'status',      headerName: 'Status',     width: 120},
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      headerName: '',
      getActions: ({ id, row }) => {
        const s = row.status as StatusPedido;
        return [
          <GridActionsCellItem
            icon={<LocalAtm />}
            label="Marcar como Pago"
            onClick={() => changeStatus(row.id, "Pago")}
            //disabled={s !== StatusPedido.Pendente}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<LocalShipping />}
            label="Marcar como Enviado"
            onClick={() => changeStatus(row.id, "Enviado")}
            //disabled={s !== StatusPedido.Pago}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<CheckCircle />}
            label="Marcar como Recebido"
            onClick={() => changeStatus(row.id, "Recebido")}
            //disabled={s !== StatusPedido.Enviado}
            showInMenu
          />
        ];
      }
    }
  ];

  return (
    <Box sx={{ mt: 3 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          getRowId={r => r.id}
          disableRowSelectionOnClick
          pageSizeOptions={[]}
          sx={{ maxWidth: '100%' }}
        />
      )}

      <Snackbar
        open={!!snack}
        message={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(undefined)}
      />
    </Box>
  );
};
