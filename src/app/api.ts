import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Person, PersonCreateDto } from '../types/Pessoa'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:7147/api/' }),
  tagTypes: ['People', 'Products', 'Orders'],
  endpoints: builder => ({
    // Pessoas
    getPeople: builder.query<Person[], { q?: string; cpf?: string }>({
      query: params => ({ url: '/pessoas', params }),
      providesTags: result =>
        result ? [...result.map(p => ({ type: 'People' as const, id: p.id })), 'People'] : ['People']
    }),
    addPerson: builder.mutation<Person, PersonCreateDto>({
      query: body => ({ url: '/pessoas', method: 'POST', body }),
      invalidatesTags: ['People']
    }),
   
  })
})

export const {
  useGetPeopleQuery,
  useAddPersonMutation
} = api
