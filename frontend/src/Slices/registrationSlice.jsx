// registrationSlice.js
// -----------------------------------------------------------------------------
// Redux Toolkit slice for the "Enroll Form" with Payment support
// -----------------------------------------------------------------------------

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const TOTAL_STEPS = 6;

export const STEP_LABELS = [
  'Personal',
  'Horoscope',
  'Education',
  'Address',
  'Family',
  'Expectation',
];

const initialFormData = {
  personal: {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobile: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    subCaste: '',
    maritalStatus: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    bloodGroup: '',
    complexion: '',
    physicalDisability: 'No',
    disabilityDetails: '',
    diet: '',
    spectacles: 'No',
  },
  horoscope: {
    rashi: '',
    nakshatra: '',
    charan: '',
    gan: '',
    gotra: '',
    manglik: '',
    birthTime: '',
    birthPlace: '',
  },
  education: {
    highestEducation: '',
    fieldOfStudy: '',
    institution: '',
    occupation: '',
    employer: '',
    annualIncome: '',
  },
  address: {
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    permanentAddress: '',
    currentAddress: '',
    sameAsPermanent: false,
  },
  family: {
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    siblings: '',
    familyType: '',
    familyStatus: '',
  },
  expectation: {
    ageFrom: '',
    ageTo: '',
    heightFrom: '',
    heightTo: '',
    education: '',
    occupation: '',
    location: '',
    otherPreferences: '',
  },
};

const initialState = {
  step: 1,
  totalSteps: TOTAL_STEPS,
  formData: initialFormData,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  successMessage: null,
  registrationCode: null, // generated login ID (e.g. REG00001)
  // Payment state
  paymentStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  paymentError: null,
  paymentData: null,
};

// ---------------------------------------------------------------------------
// Async thunk: POST the completed form to the backend.
// ---------------------------------------------------------------------------
export const submitRegistration = createAsyncThunk(
  'registration/submitRegistration',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        return rejectWithValue(
          (errorBody && errorBody.message) ||
            `Submission failed (status ${response.status}). Please try again.`
        );
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(
        err.message || 'Network error. Please check your connection and try again.'
      );
    }
  }
);

// ---------------------------------------------------------------------------
// Async thunk: POST payment verification
// ---------------------------------------------------------------------------
export const submitPayment = createAsyncThunk(
  'registration/submitPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('transactionId', paymentData.transactionId);
      formData.append('upiId', paymentData.upiId);
      formData.append('amount', paymentData.amount);
      formData.append('registrationId', paymentData.registrationId);
      
      if (paymentData.screenshot) {
        formData.append('screenshot', paymentData.screenshot);
      }

      const response = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        return rejectWithValue(
          (errorBody && errorBody.message) ||
            `Payment verification failed (status ${response.status}).`
        );
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(
        err.message || 'Network error. Please check your connection and try again.'
      );
    }
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    // Generic field updater used by every step.
    updateField: (state, action) => {
      const { section, field, value } = action.payload;
      if (state.formData[section] && field in state.formData[section]) {
        state.formData[section][field] = value;
      }
    },
    nextStep: (state) => {
      if (state.step < state.totalSteps) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    goToStep: (state, action) => {
      const target = action.payload;
      if (target >= 1 && target <= state.totalSteps) state.step = target;
    },
    resetForm: (state) => {
      state.step = 1;
      state.formData = initialFormData;
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
      state.registrationCode = null;
      state.paymentStatus = 'idle';
      state.paymentError = null;
      state.paymentData = null;
    },
    clearSubmissionStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    },
    setPaymentDetails: (state, action) => {
      state.paymentData = { ...state.paymentData, ...action.payload };
    },
    resetPaymentStatus: (state) => {
      state.paymentStatus = 'idle';
      state.paymentError = null;
      state.paymentData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration
      .addCase(submitRegistration.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitRegistration.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage =
          (action.payload && action.payload.message) ||
          'Your profile has been submitted successfully!';
        state.registrationCode = action.payload.registrationCode || null;
        state.paymentData = {
          ...state.paymentData,
          // link payment to the real registration code (falls back to id)
          registrationId: action.payload.registrationCode || action.payload.id || action.payload.registrationId,
        };
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong. Please try again.';
      })
      // Payment
      .addCase(submitPayment.pending, (state) => {
        state.paymentStatus = 'loading';
        state.paymentError = null;
      })
      .addCase(submitPayment.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.paymentData = { ...state.paymentData, ...action.payload };
        state.paymentError = null;
        state.successMessage = 'Payment verified! Registration complete.';
        state.status = 'succeeded';
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.paymentError = action.payload || 'Payment verification failed. Please try again.';
      });
  },
});

export const {
  updateField,
  nextStep,
  prevStep,
  goToStep,
  resetForm,
  clearSubmissionStatus,
  setPaymentDetails,
  resetPaymentStatus,
} = registrationSlice.actions;

export default registrationSlice.reducer;