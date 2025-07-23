import Stack from "@mui/material/Stack"
import { Edit, Delete} from "@mui/icons-material"
import { type GridColDef, GridActionsCellItem, DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState } from "react"
import type { Produto, ProdutoCreateDto } from "../../types/Produtos"
import { productService } from "../../services/productService"
import { Box, Button, CircularProgress, Paper, Snackbar, TextField, Typography } from "@mui/material"
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup'  
import { yupResolver } from "@hookform/resolvers/yup"
import { set, useForm } from "react-hook-form"

const ProdutosPage = () => {
  const navigate = useNavigate();
  
  const [selected, setSelected]   = useState<Produto | null>(null);
  const [produtos, setProduct] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGrid, setshowGrid] = useState(true);
  const [snack, setSnack] = useState<string>();
  const [isEdit, setisEdit] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  
  const [error, setError]     = useState<string>();

  const schema = yup.object({
      nome: yup.string().required('Nome obrigatório'),   
    })

  const { register, handleSubmit, reset, formState:{errors}  } = useForm<ProdutoCreateDto>({
    resolver: yupResolver(schema),
    defaultValues: { id: 0, nome:'', valor: 0, codigo:'' }
  });


  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await productService.all()
        setProduct(data)
      } catch (e: any) {
        setError(e.message ?? 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

 const onSubmit = async (dto: ProdutoCreateDto) => {
    try {
      if (isEdit) {
        await productService.update(dto);
        setSnack('Pessoa atualizada!');
      } else {
        await productService.create(dto);
        setSnack('Pessoa criada!');
      }
      navigate('/produtos');
      setshowGrid(true);

      setLoading(true)
      const data = await productService.all()
      setProduct(data)
      setLoading(false)

    } catch {
      setSnack('Erro ao salvar');
    }
  };

const onCancelEdit = () => {
    setshowGrid(true);
} 

    const openEdit = useCallback((id: number) => {
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;     
        setSelected(produto);                 
        setshowGrid(false);
        setisEdit(true);
        reset(produto)

      }, [produtos])
      
    const handleDelete = async (id: number) => {
        if (!confirm('Confirma excluir esta pessoa?')) return;
        await productService.remove(id);
        setProduct(prev => prev.filter(p => p.id !== id));  
      };
  
    const columns: GridColDef[] = [
      { field: 'nome', headerName: 'Nome',  width: 200 },
      { field: 'codigo', headerName: 'Código', width: 200 },
      { field: 'valor', headerName: 'Valor', width: 200,  type: 'number' },
      {
        field: 'actions',
        type: 'actions',
        getActions: ({ id }) => [
          <GridActionsCellItem label="Editar" icon={<Edit />} onClick={() => openEdit(+id)} />,
          <GridActionsCellItem label="Excluir" icon={<Delete />} onClick={() => handleDelete(+id)} />,
        ]
      }
    ]

    const handleNew = () => {
      reset({ id: 0, nome:'', valor: 0, codigo:'' });
      setSelected(null);                 
      setshowGrid(false);
      setisEdit(false);
      setisSubmitting(false);
    };

    if (loading) return <p>Carregando…</p>;
    if (error)   return <p style={{ color: 'red' }}>{error}</p>;
  
    if (showGrid)
      return (

        <Box
          sx={{
            flexGrow: 1,               
            height: `calc(100vh - 64px)` 
          }}
        >        
          <Button variant="outlined" onClick={() => handleNew()}>
            Incluir
          </Button>

            <DataGrid rows={produtos} columns={columns} autoHeight loading={loading} />

          <Button variant="outlined" onClick={() => navigate('/')}>
            Voltar
          </Button>


        </Box>
      )

    
    return (
      <Paper sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? 'Editar Produto' : 'Novo Produto'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Nome"
              {...register('nome')}
              error={!!errors.nome}
              helperText={errors.nome?.message}
              fullWidth
            />

            <TextField
              label="Codigo"
              {...register('codigo')}
              error={!!errors.codigo}
              helperText={errors.codigo?.message}
              inputProps={{ maxLength: 14 }}
            />

            <TextField
              label="Valor"
              {...register('valor')}
              error={!!errors.valor}
              helperText={errors.valor?.message}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => onCancelEdit()}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting && <CircularProgress size={20} sx={{ mr: 1 }} />}
                Salvar
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Snackbar
          open={!!snack}
          message={snack}
          autoHideDuration={4000}
          onClose={() => setSnack(undefined)}
        />
      </Paper>
    );
  }
  
  

export default ProdutosPage