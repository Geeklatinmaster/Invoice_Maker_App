import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrandProfile {
  id: string;
  name: string;
  prefix: string; // For document codes like "GLM", "ABC"
  currency: 'USD' | 'EUR' | 'VES';
  locale: string; // e.g., 'es-ES', 'en-US'
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface BrandState {
  brands: BrandProfile[];
  activeBrandId: string | null;
  addBrand: (brand: Omit<BrandProfile, 'id'>) => string;
  updateBrand: (id: string, updates: Partial<BrandProfile>) => void;
  deleteBrand: (id: string) => void;
  setActiveBrand: (id: string) => void;
  getActiveBrand: () => BrandProfile | null;
}

const defaultBrand: BrandProfile = {
  id: 'default',
  name: 'JEGS',
  prefix: 'GLM',
  currency: 'USD',
  locale: 'es-ES',
};

export const useBrands = create<BrandState>()(
  persist(
    (set, get) => ({
      brands: [defaultBrand],
      activeBrandId: 'default',
      
      addBrand: (brand) => {
        const id = `brand-${Date.now()}`;
        const newBrand = { ...brand, id };
        set((state) => ({
          brands: [...state.brands, newBrand]
        }));
        return id;
      },
      
      updateBrand: (id, updates) => {
        set((state) => ({
          brands: state.brands.map(brand => 
            brand.id === id ? { ...brand, ...updates } : brand
          )
        }));
      },
      
      deleteBrand: (id) => {
        set((state) => {
          const newBrands = state.brands.filter(brand => brand.id !== id);
          const newActiveBrandId = state.activeBrandId === id 
            ? (newBrands[0]?.id || null)
            : state.activeBrandId;
          
          return {
            brands: newBrands,
            activeBrandId: newActiveBrandId
          };
        });
      },
      
      setActiveBrand: (id) => {
        const brand = get().brands.find(b => b.id === id);
        if (brand) {
          set({ activeBrandId: id });
        }
      },
      
      getActiveBrand: () => {
        const { brands, activeBrandId } = get();
        return brands.find(brand => brand.id === activeBrandId) || brands[0] || null;
      }
    }),
    {
      name: 'invoice-brands-store',
      version: 1,
    }
  )
);

export const useActiveBrand = () => useBrands(state => state.getActiveBrand());