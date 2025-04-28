import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Emprunt, StatutEmprunt } from '../../types';

interface EmpruntsState {
  items: Emprunt[];
  selectedEmprunt: Emprunt | null;
  loading: boolean;
  error: string | null;
  filters: {
    statut: StatutEmprunt | null;
    adherentId: string | null;
    documentId: string | null;
  };
}

const initialState: EmpruntsState = {
  items: [],
  selectedEmprunt: null,
  loading: false,
  error: null,
  filters: {
    statut: null,
    adherentId: null,
    documentId: null,
  },
};

export const fetchEmprunts = createAsyncThunk(
  'emprunts/fetchEmprunts',
  async (_, { rejectWithValue }) => {
    try {
      // Simuler une requête API
      return [] as Emprunt[]; // À remplacer par un appel API réel
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Une erreur inconnue est survenue');
    }
  }
);

const empruntsSlice = createSlice({
  name: 'emprunts',
  initialState,
  reducers: {
    setSelectedEmprunt: (state, action: PayloadAction<Emprunt | null>) => {
      state.selectedEmprunt = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<EmpruntsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmprunts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmprunts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEmprunts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedEmprunt, setFilter, clearFilters } = empruntsSlice.actions;
export default empruntsSlice.reducer;
