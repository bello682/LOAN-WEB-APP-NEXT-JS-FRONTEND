import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loanAPI } from "../../api";

interface Loan {
  _id: string;
  loanType: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  monthlyPayment: number;
  totalRepayment: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface LoanState {
  loans: Loan[];
  currentLoan: Loan | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  calculatorResult: {
    monthlyPayment: number;
    totalRepayment: number;
    totalInterest: number;
  } | null;
}

const initialState: LoanState = {
  loans: [],
  currentLoan: null,
  isLoading: false,
  error: null,
  isSuccess: false,
  calculatorResult: null,
};

// Thunks
export const fetchMyLoans = createAsyncThunk(
  "loans/fetchMyLoans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await loanAPI.getMyLoans();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans",
      );
    }
  },
);

export const getAllLoans = createAsyncThunk(
  "loans/getAllLoans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await loanAPI.getAllLoans();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loans",
      );
    }
  },
);

export const getLoanById = createAsyncThunk(
  "loans/getLoanById",
  async (loanId: string, { rejectWithValue }) => {
    try {
      const response = await loanAPI.getLoanById(loanId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch loan",
      );
    }
  },
);

export const createLoan = createAsyncThunk(
  "loans/createLoan",
  async (loanData: any, { rejectWithValue }) => {
    try {
      const response = await loanAPI.createLoan(loanData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create loan",
      );
    }
  },
);

export const updateLoan = createAsyncThunk(
  "loans/updateLoan",
  async (
    { loanId, loanData }: { loanId: string; loanData: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await loanAPI.updateLoan(loanId, loanData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update loan",
      );
    }
  },
);

const loanSlice = createSlice({
  name: "loans",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch My Loans
    builder.addCase(fetchMyLoans.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyLoans.fulfilled, (state, action) => {
      state.isLoading = false;
      state.loans = action.payload.loans || [];
      state.isSuccess = true;
    });
    builder.addCase(fetchMyLoans.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get All Loans
    builder.addCase(getAllLoans.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllLoans.fulfilled, (state, action) => {
      state.isLoading = false;
      state.loans = action.payload.loans || [];
      state.isSuccess = true;
    });
    builder.addCase(getAllLoans.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Get Loan By ID
    builder.addCase(getLoanById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getLoanById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentLoan = action.payload.loan || action.payload;
      state.isSuccess = true;
    });
    builder.addCase(getLoanById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Loan
    builder.addCase(createLoan.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createLoan.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentLoan = action.payload.loan || action.payload;
      state.loans.push(action.payload.loan || action.payload);
      state.isSuccess = true;
    });
    builder.addCase(createLoan.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Loan
    builder.addCase(updateLoan.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateLoan.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentLoan = action.payload.loan || action.payload;
      const index = state.loans.findIndex(
        (l) => l._id === (action.payload.loan?._id || action.payload._id),
      );
      if (index !== -1) {
        state.loans[index] = action.payload.loan || action.payload;
      }
      state.isSuccess = true;
    });
    builder.addCase(updateLoan.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, clearSuccess } = loanSlice.actions;
export default loanSlice.reducer;
