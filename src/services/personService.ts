import type { Pessoa, PessoaCreateDto } from '../types/Pessoas';
import { http } from './http';

export const personService = {
  all() {
    return http.get<Pessoa[]>('/Pessoas').then(r => r.data);
  },
  filter(params?: { nome?: string; codigo?: string; valormin?: number; valormax?: number }) {
    return http.get<Pessoa[]>('/Pessoas/filter', { params }).then(r => r.data);
  },
  get:    (id: number)                   => http.get<Pessoa>(`/Pessoas/${id}`).then(r => r.data),
  create: (dto: PessoaCreateDto)        => http.post<Pessoa>('/Pessoas', dto).then(r => r.data),
  update: (dto: PessoaCreateDto)        => http.put<Pessoa>(`/Pessoas`, dto).then(r => r.data),
  remove: (id: number)                   => http.delete(`/Pessoas/${id}`),
  pedidos: (id: number)                   => http.get<Pessoa>(`/Pessoas/$${id}/pedidos`).then(r => r.data),
};