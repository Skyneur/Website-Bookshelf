import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Document, DocumentType } from '../../types';
import axios from 'axios';

interface DocumentsState {
  items: Document[];
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
  filters: {
    type: DocumentType | null;
    disponible: boolean | null;
    categorie: string | null;
    searchTerm: string;
  };
}

const initialState: DocumentsState = {
  items: [],
  selectedDocument: null,
  loading: false,
  error: null,
  filters: {
    type: null,
    disponible: null,
    categorie: null,
    searchTerm: '',
  },
};

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Simuler une requête API
      // Dans une implémentation réelle, vous utiliseriez axios pour récupérer les données
      return [] as Document[]; // À remplacer par un appel API réel
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Une erreur inconnue est survenue');
    }
  }
);

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setSelectedDocument: (state, action: PayloadAction<Document | null>) => {
      state.selectedDocument = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<DocumentsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedDocument, setFilter, clearFilters } = documentsSlice.actions;
export default documentsSlice.reducer;
