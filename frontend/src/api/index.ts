import axios from 'axios'
import type { Entry, EntryCreate, EntryUpdate, AskResponse } from '../types'

const http = axios.create({ baseURL: '/api' })

export const entriesApi = {
  list: (params?: { category?: string; q?: string }) =>
    http.get<Entry[]>('/entries', { params }).then(r => r.data),

  get: (id: number) =>
    http.get<Entry>(`/entries/${id}`).then(r => r.data),

  create: (data: EntryCreate) =>
    http.post<Entry>('/entries', data).then(r => r.data),

  update: (id: number, data: EntryUpdate) =>
    http.patch<Entry>(`/entries/${id}`, data).then(r => r.data),

  remove: (id: number) =>
    http.delete(`/entries/${id}`),
}

export const aiApi = {
  ask: (question: string) =>
    http.post<AskResponse>('/ai/ask', { question }).then(r => r.data),
}
