import type { Produto, ProdutoCreateDto } from '../types/Produtos';
import { http } from './http';

export const productService = {
  all() {
    return http.get<Produto[]>('/Produtos').then(r => r.data);
  },
  filter(params?: { nome?: string; codigo?: string; valormin?: number; valormax?: number }) {
    return http.get<Produto[]>('/Produtos/filter', { params }).then(r => r.data);
  },
  get:    (id: number)                   => http.get<Produto>(`/Produtos/${id}`).then(r => r.data),
  create: (dto: ProdutoCreateDto)        => http.post<Produto>('/Produtos', dto).then(r => r.data),
  update: (dto: ProdutoCreateDto)        => http.put<Produto>(`/Produtos`, dto).then(r => r.data),
  remove: (id: number)                   => http.delete(`/Produtos/${id}`)
};