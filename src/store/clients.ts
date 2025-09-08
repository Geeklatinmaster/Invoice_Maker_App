import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Client = {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  taxId?: string
  invoices?: number
  balance?: number // USD
  notes?: string
}

export type ClientsState = {
  clients: Client[]
  selectedClientId: string | null
  // actions
  addClient: (data: Omit<Client, 'id'>) => string
  updateClient: (id: string, patch: Partial<Client>) => void
  selectClient: (id: string | null) => void
}

const seed: Client[] = [
  { id: 'c1', name: 'Geekatlantic LLC', email: 'demo@email.com', invoices: 14, balance: 445, phone: '+1 202 555 0133', address: 'Miami, FL', taxId: 'EIN 12-345678', notes: 'Cliente corporativo' },
  { id: 'c2', name: 'Acme Inc.',        email: 'billing@acme.com', invoices: 8,  balance: 0 },
  { id: 'c3', name: 'John Doe',         email: 'john@example.com',  invoices: 3,  balance: 120 },
]

export const useClients = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: seed,
      selectedClientId: seed[0]?.id ?? null,

      addClient: (data) => {
        const id = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`
        const next: Client = { invoices: 0, balance: 0, ...data, id }
        set({ clients: [next, ...get().clients], selectedClientId: id })
        return id
      },

      updateClient: (id, patch) => {
        set({ clients: get().clients.map(c => (c.id === id ? { ...c, ...patch } : c)) })
      },

      selectClient: (id) => set({ selectedClientId: id }),
    }),
    { name: 'im_clients_v1' }
  )
)

// Selectores útiles
export const useSelectedClient = () => {
  return useClients(s => s.clients.find(c => c.id === s.selectedClientId) ?? null)
}