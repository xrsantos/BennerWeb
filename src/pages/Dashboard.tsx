import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Stack
} from '@mui/material';
import PeopleAltIcon   from '@mui/icons-material/PeopleAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon      from '@mui/icons-material/ListAlt';

const modules = [
  {
    label: 'Pessoas',
    icon: <PeopleAltIcon sx={{ fontSize: 60 }} />,
    path: '/pessoas',
    description: 'Dados de pessoas cadastradas'
  },
  {
    label: 'Produtos',
    icon: <ShoppingCartIcon sx={{ fontSize: 60 }} />,
    path: '/produtos',
    description: 'Gerenciar catálogo de produtos'
  },
  {
    label: 'Pedidos',
    icon: <ListAltIcon sx={{ fontSize: 60 }} />,
    path: '/pedidos',
    description: 'Criar e acompanhar pedidos'
  }
];

export const Dashboard = () => (
  <Stack sx={{ height: '100vh' }}>…<Box sx={{ flex: 1 }}> 
    <Typography variant="h4" gutterBottom>
      Menu principal
    </Typography>

    <Grid container spacing={4}>
      {modules.map(m => (
        <Grid item xs={12} sm={6} md={4} key={m.path}>
          <Card elevation={3}>
            <CardActionArea
              component={RouterLink}
              to={m.path}
              sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {m.icon}
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{m.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {m.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
  </Stack>
);
