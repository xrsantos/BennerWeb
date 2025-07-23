import Stack from "@mui/material/Stack"
import { Edit, Delete} from "@mui/icons-material"
import { type GridColDef, GridActionsCellItem, DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState } from "react"
import type { Pessoa, PessoaCreateDto } from "../../types/Pessoas"
import { personService } from "../../services/personService"
import { Box, Button, CircularProgress, Paper, Snackbar, TextField, Typography } from "@mui/material"
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup'  
import { yupResolver } from "@hookform/resolvers/yup"
import { set, useForm } from "react-hook-form"
import { PessoaPedidoGrid } from "../../componentes/pedido/PessoaPedidoGrid"

const PessoasPage = () => {
  const navigate = useNavigate();
  
  const [selected, setSelected]   = useState<Pessoa | null>(null);
  const [Pessoas, setProduct] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGrid, setshowGrid] = useState(true);
  const [snack, setSnack] = useState<string>();
  const [isEdit, setisEdit] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [error, setError]     = useState<string>();

  const schema = yup.object({
      nome: yup.string().required('Nome obrigatório'),   
      cpf: yup.string().required('cpf obrigatório')
    })

  const { register, handleSubmit, reset, formState:{errors}  } = useForm<PessoaCreateDto>({
    resolver: yupResolver(schema),
    defaultValues: { id: 0, nome:'', cpf: '', endereco:'' }
  });


  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await personService.all()
        setProduct(data)
      } catch (e: any) {
        setError(e.message ?? 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

 const onSubmit = async (dto: PessoaCreateDto) => {
    try {
      if (isEdit) {
        await personService.update(dto);
        setSnack('Pessoa atualizada!');
      } else {
        await personService.create(dto);
        setSnack('Pessoa criada!');
      }
      navigate('/Pessoas');
      setshowGrid(true);

      setLoading(true)
      const data = await personService.all()
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
        const Pessoa = Pessoas.find(p => p.id === id);
        if (!Pessoa) return;     
        setSelected(Pessoa);                 
        setshowGrid(false);
        setisEdit(true);
        reset(Pessoa)

      }, [Pessoas])
      
    const handleDelete = async (id: number) => {
        if (!confirm('Confirma excluir esta pessoa?')) return;
        await personService.remove(id);
        setProduct(prev => prev.filter(p => p.id !== id));  
      };
  
    const columns: GridColDef[] = [
      { field: 'nome', headerName: 'Nome',  width: 200 },
      { field: 'cpf', headerName: 'CPF', width: 200 },
      { field: 'endereco', headerName: 'Endereço', width: 200 },
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
      reset({ id: 0, nome:'', cpf: '', endereco:'' });
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

            <DataGrid rows={Pessoas} columns={columns} autoHeight loading={loading} onRowClick={p => setSelected(p.row)} />

            {selected && (
              <PessoaPedidoGrid
                personId={selected.id}
                onStatusChanged={() => {/* refetch contadores etc. */}}
              />
            )}

          <Button variant="outlined" onClick={() => navigate('/')} >
            Voltar
          </Button>


        </Box>
      )

    
    return (
      <Paper sx={{ maxWidth: 900, mx: 'auto', mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEdit ? 'Editar Pessoa' : 'Novo Pessoa'}
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
              label="CPF"
              {...register('cpf')}
              error={!!errors.codigo}
              helperText={errors.codigo?.message}
              inputProps={{ maxLength: 14 }}
            />

            <TextField
              label="Endereço"
              {...register('endereco')}
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
  
  

export default PessoasPage