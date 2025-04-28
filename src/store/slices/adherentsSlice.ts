import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Adherent } from '../../types';

interface AdherentsState {
  items: Adherent[];
  selectedAdherent: Adherent | null;
  loading: boolean;
  error: string | null;
  filters: {
    abonnementActif: boolean | null;
    searchTerm: string;
  };
}

const initialState: AdherentsState = {
  items: [],
  selectedAdherent: null,
  loading: false,
  error: null,
  filters: {
    abonnementActif: null,
    searchTerm: '',
  },
};

export const fetchAdherents = createAsyncThunk(
  'adherents/fetchAdherents',
  async (_, { rejectWithValue }) => {
    try {
      // Simuler une requête API
      return [] as Adherent[]; // À remplacer par un appel API réel
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Une erreur inconnue est survenue');
    }
  }
);

const adherentsSlice = createSlice({
  name: 'adherents',
  initialState,
  reducers: {
    setSelectedAdherent: (state, action: PayloadAction<Adherent | null>) => {
      state.selectedAdherent = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<AdherentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdherents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdherents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdherents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedAdherent, setFilter, clearFilters } = adherentsSlice.actions;
export default adherentsSlice.reducer;
