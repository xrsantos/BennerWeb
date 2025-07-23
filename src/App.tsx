import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppBar, Container } from '@mui/material'
import PessoaPage from './features/pessoa/PessoaPage' 
import { Dashboard } from './pages/Dashboard'
import ProdutosPage from './features/produtos/ProdutosPage'
import { PedidoPage } from './features/pedido/PedidoPage'

const App = () => (
  <ThemeProvider theme={createTheme()}>
    <CssBaseline />
    <BrowserRouter>
      <AppBar position="static">Lojas Benner - Sistema de Gerenciamento</AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
         <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<PessoaPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/pedidos" element={<PedidoPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  </ThemeProvider>
)


export default App
