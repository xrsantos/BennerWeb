
import { type GridColDef, GridActionsCellItem, DataGrid } from "@mui/x-data-grid";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import type { Produto } from "../../types/Produtos";
import type { PedidoItem } from "../../types/PedidoItem";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { Delete, Edit } from "@mui/icons-material";
import { ProductAutocomplete } from "../Produto/ProductAutocompleteProps";



interface Props {
  /** Lista global de produtos (para o autocomplete) */
  products: Produto[];
  /** Callback com itens prontos p/ tela‑pai */
  onChange?: (items: PedidoItem[]) => void;
}

export const OrderItemsGrid: React.FC<Props> = ({ products, onChange }) => {
  
  const [items, setItems] = useState<PedidoItem[]>([]);
  const [editItem, setEditItem] = useState<PedidoItem | null>(null);     // item em edição
  const [prodSel, setProdSel] = useState<Produto | null>(null);
  const [qty, setQty]         = useState<number>(1);

  /* ─────────── Helpers ─────────── */

  const handleAdd = () => {
    if (!prodSel) return;
    const item: PedidoItem = {
      tempId: nanoid(),
      produto: prodSel,
      quantidade: qty,
      precoUnitario: prodSel.valor
    };
    const next = [...items, item];
    setItems(next);
    onChange?.(next);
    // limpa campos
    setProdSel(null);
    setQty(1);
  };

  const handleDelete = (tempId: string) => {
    const next = items.filter(i => i.tempId !== tempId);
    setItems(next);
    onChange?.(next);
  };

  const handleEditSave = (newQty: number) => {
    if (!editItem) return;
    const next = items.map(i =>
      i.tempId === editItem.tempId ? { ...i, quantidade: newQty } : i
    );
    setItems(next);
    onChange?.(next);
    setEditItem(null);
    
  };

  const totalGeral = items.reduce(
    (acc, it) => acc + it.quantidade * it.precoUnitario,
    0
  );

  /* ─────────── Colunas DataGrid ─────────── */

  const columns: GridColDef[] = [
    { field: 'produto', headerName: 'Produto', flex: 1},
    { field: 'quantidade', headerName: 'Qtd.', width: 90, type: 'number' },
    { field: 'precoUnitario', headerName: 'Valor (R$)', width: 130, type: 'number'},
    { field: 'total', headerName: 'Total (R$)', width: 140, type: 'number'},
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 200,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Alterar"
          onClick={() => setEditItem(row)}
        />,
        <GridActionsCellItem
          icon={<Delete color="error" />}
          label="Excluir"
          onClick={() => handleDelete(row.tempId)}
        />
      ]
    }
  ];

  return (
    <Stack spacing={4}>
      {/* Área de seleção (produto + qtd) */}
      <Stack direction="row" spacing={4}>
        <ProductAutocomplete
          options={products}
          value={prodSel}
          onChange={setProdSel}
          label="Produto"
        />
        <TextField
          label="Qtd."
          type="number"
          inputProps={{ min: 1 }}
          value={qty}
          onChange={e => setQty(+e.target.value)}
          sx={{ width: 100 }}
        />
        <Button variant="contained" onClick={handleAdd}>
          Adicionar
        </Button>
      </Stack>

      {/* Grid de itens */}
      <DataGrid
        
        rows={items}
        columns={columns}
        getRowId={row => row.tempId}   // Importante: usa tempId
        pageSizeOptions={[]}           // desativa paginação
        disableRowSelectionOnClick
      />

      <Box sx={{ textAlign: 'right', fontWeight: 'bold' }}>
        Valor total:&nbsp;
        {totalGeral.toLocaleString('pt-BR', { style:'currency', currency:'BRL' })}
      </Box>

      {/* Dialogo de edição de quantidade */}
      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Alterar quantidade</DialogTitle>
        <DialogContent>
          <TextField
            label="Quantidade"
            type="number"
            fullWidth
            margin="dense"
            inputProps={{ min: 1 }}
            value={editItem?.quantidade ?? 1}
            onChange={e =>
              setEditItem(
                editItem ? { ...editItem, quantidade: +e.target.value } : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => handleEditSave(editItem!.quantidade)}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
