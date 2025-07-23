import { useEffect, useState } from 'react';
import { PersonAutocomplete, type Person } from '../../componentes/Pessoa/PersonAutocomplete';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { personService } from '../../services/personService';
import { productService } from '../../services/productService';
import type { Produto } from '../../types/Produtos';
import { OrderItemsGrid } from '../../componentes/pedido/OrderItemsGrid';
import { FormaPagamentoSelect } from '../../componentes/pedido/FormaPagamentoSelect';
import { type FormaPagamento } from "../../types/Pedido";
import type { PedidoItem } from '../../types/PedidoItem';
import { orderService } from '../../services/orderService';



export const PedidoPage = () => {
    const navigate = useNavigate();
    const [pessoas, setPessoas]   = useState<Person[]>([]);
    const [produtos, setProdutos]   = useState<Produto[]>([]);
    const [loading, setLoading]   = useState(false);
    const [selected, setSelected] = useState<Person | null>(null);
    const [formaPgto, setFormaPgto] = useState<FormaPagamento>(1);
    const [pedidosItems, setPedidosItems] = useState<PedidoItem>();

    useEffect(() => {
        setLoading(true);
        setTimeout(async () => {
        const data = await personService.all()
        const dataproducts = await productService.all();
        setPessoas(data);
        setProdutos(dataproducts);
        setLoading(false);
        }, 800);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        setTimeout(async () => {
            const data = await orderService.save(selected?.id, pedidosItems, formaPgto);

        setLoading(false);
        }, 800);
        navigate("/");
    }

    return (

    <Stack sx={{ height: '100vh' }}>
        <Box sx={{ flex: 1 }}> 
            <Grid container spacing={8}>
                <Typography variant="h4" gutterBottom>
                    Pedidos ${selected?.id}
                </Typography>
                <PersonAutocomplete
                    options={pessoas}
                    value={selected}
                    onChange={setSelected}
                    loading={loading}
                />
                <FormaPagamentoSelect value={formaPgto} onChange={setFormaPgto}></FormaPagamentoSelect>
                <OrderItemsGrid products={produtos} onChange={setPedidosItems}></OrderItemsGrid>

            </Grid>
                <Button variant="outlined" onClick={() => handleSave()}>
                    Salvar
                </Button>
                
                <Button variant="outlined" onClick={() => navigate('/')}>
                    Voltar
                </Button>
        </Box>
    </Stack>

  );
};