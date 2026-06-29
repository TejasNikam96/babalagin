import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../../assets/css/Registration.css';
import { 
  resetForm, 
  updateField,
  nextStep,
  prevStep,
  goToStep,
  submitRegistration,
  clearSubmissionStatus,
  STEP_LABELS,
  submitPayment,
  resetPaymentStatus,
} from '../../Slices/registrationSlice';

// All your existing constants
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTH_OPTIONS = [
  { value: '01', label: 'Jan' }, { value: '02', label: 'Feb' }, { value: '03', label: 'Mar' },
  { value: '04', label: 'Apr' }, { value: '05', label: 'May' }, { value: '06', label: 'Jun' },
  { value: '07', label: 'Jul' }, { value: '08', label: 'Aug' }, { value: '09', label: 'Sep' },
  { value: '10', label: 'Oct' }, { value: '11', label: 'Nov' }, { value: '12', label: 'Dec' },
];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => String(CURRENT_YEAR - i));

const SUB_CASTE_OPTIONS = ['96 Kuli', '92 Kuli', 'Deshmukh', 'Patil', 'Other'];
const MARITAL_STATUS_OPTIONS = ['Unmarried Boy', 'Unmarried Girl', 'Divorced', 'Widow / Widower', 'Awaiting Divorce'];
const HEIGHT_FEET_OPTIONS = ['4', '5', '6', '7'];
const HEIGHT_INCH_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i).padStart(2, '0'));
const WEIGHT_OPTIONS = Array.from({ length: 91 }, (_, i) => String(30 + i));
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const COMPLEXION_OPTIONS = ['Very Fair', 'Fair', 'Wheatish', 'Dark'];
const YES_NO_OPTIONS = ['No', 'Yes'];
const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];

const RASHI_OPTIONS = [
  'Mesh (Aries)', 'Vrishabha (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)', 'Sinh (Leo)',
  'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)', 'Dhanu (Sagittarius)',
  'Makar (Capricorn)', 'Kumbha (Aquarius)', 'Meen (Pisces)',
];
const NAKSHATRA_OPTIONS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];
const CHARAN_OPTIONS = ['1', '2', '3', '4'];
const GAN_OPTIONS = ['Dev', 'Manushya', 'Rakshas'];
const MANGLIK_OPTIONS = ['No', 'Anshik (Partial)', 'Yes'];

const EDUCATION_OPTIONS = ['10th', '12th', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD / Doctorate', 'Other'];
const OCCUPATION_OPTIONS = ['Private Job', 'Government Job', 'Business', 'Self-Employed', 'Student', 'Not Working'];
const INCOME_OPTIONS = ['Below 2 LPA', '2 - 5 LPA', '5 - 10 LPA', '10 - 15 LPA', '15 - 25 LPA', '25+ LPA'];

const STATE_OPTIONS = ['Maharashtra', 'Gujarat', 'Karnataka', 'Madhya Pradesh', 'Goa', 'Delhi', 'Other'];

const FAMILY_TYPE_OPTIONS = ['Nuclear', 'Joint'];
const FAMILY_STATUS_OPTIONS = ['Middle Class', 'Upper Middle Class', 'Rich / Affluent'];
const SIBLING_OPTIONS = Array.from({ length: 9 }, (_, i) => String(i));

const AGE_RANGE_OPTIONS = Array.from({ length: 43 }, (_, i) => String(18 + i));
const HEIGHT_RANGE_OPTIONS = (() => {
  const list = [];
  for (let f = 4; f <= 7; f += 1) {
    for (let i = 0; i <= 11; i += 1) list.push(`${f}'${i}"`);
  }
  return list;
})();

/* ----------------------------------------------------------------------- */
/* Small reusable field components                                         */
/* ----------------------------------------------------------------------- */

const FieldSelect = ({ label, required, value, onChange, options, placeholder = 'Select', error, disabled }) => (
  <div className="ef-field">
    <label className="ef-field__label">
      {required && <span className="ef-field__asterisk">*</span>}{label}
    </label>
    <select
      className={`ef-select${error ? ' ef-input--error' : ''}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => {
        const optValue = typeof opt === 'object' ? opt.value : opt;
        const optLabel = typeof opt === 'object' ? opt.label : opt;
        return (
          <option key={optValue} value={optValue}>{optLabel}</option>
        );
      })}
    </select>
    {error && <span className="ef-field__error">{error}</span>}
  </div>
);

const FieldText = ({ label, required, value, onChange, placeholder, error, disabled, type = 'text', maxLength }) => (
  <div className="ef-field">
    <label className="ef-field__label">
      {required && <span className="ef-field__asterisk">*</span>}{label}
    </label>
    <input
      type={type}
      className={`ef-input${error ? ' ef-input--error' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
    />
    {error && <span className="ef-field__error">{error}</span>}
  </div>
);

const FieldTextArea = ({ label, required, value, onChange, placeholder, error, disabled, rows = 3 }) => (
  <div className="ef-field ef-field--full">
    <label className="ef-field__label">
      {required && <span className="ef-field__asterisk">*</span>}{label}
    </label>
    <textarea
      className={`ef-textarea${error ? ' ef-input--error' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
    />
    {error && <span className="ef-field__error">{error}</span>}
  </div>
);

const FieldSplit = ({ label, required, error, children }) => (
  <div className="ef-field">
    <label className="ef-field__label">
      {required && <span className="ef-field__asterisk">*</span>}{label}
    </label>
    <div className="ef-split">{children}</div>
    {error && <span className="ef-field__error">{error}</span>}
  </div>
);

/* ----------------------------------------------------------------------- */
/* Payment Dialog Component                                                */
/* ----------------------------------------------------------------------- */

export const PaymentDialog = ({ isOpen, onClose, onPaymentSubmit, isLoading, amount = 1000, feeLabel = "Registration Fee", title = "Make Payment" }) => {
  const amountStr = `₹${Number(amount).toLocaleString("en-IN")}`;
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const UPI_ID = 'babalagin@paytm';
  const PHONE_PAY_NUMBER = '9876543210';
  const GOOGLE_PAY_NUMBER = '9876543210';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    alert('UPI ID copied to clipboard!');
  };

  const handleSubmitPayment = () => {
    if (!transactionId.trim()) {
      setError('Please enter transaction ID');
      return;
    }
    if (!screenshot) {
      setError('Please upload payment screenshot');
      return;
    }

    const paymentData = {
      transactionId: transactionId.trim(),
      screenshot: screenshot,
      upiId: UPI_ID,
      amount: amount,
    };

    onPaymentSubmit(paymentData);
  };

  const resetFormFields = () => {
    setTransactionId('');
    setScreenshot(null);
    setScreenshotPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetFormFields();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="ef-dialog-overlay" onClick={handleClose}>
      <div className="ef-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="ef-dialog__header">
          <h2 className="ef-dialog__title">{title}</h2>
          <button className="ef-dialog__close" onClick={handleClose}>×</button>
        </div>

        <div className="ef-dialog__body">
          <div className="ef-payment-details">
            <div className="ef-payment-amount">
              <span className="ef-payment-label">{feeLabel}:</span>
              <span className="ef-payment-value">{amountStr}</span>
            </div>

            <div className="ef-payment-methods">
              <h3 className="ef-payment-methods-title">Payment Options</h3>
              
              <div className="ef-payment-qr-section">
                <div style={{ border: "2px dashed #b8860b", borderRadius: 12, padding: 16, textAlign: "center", background: "#fdf3da" }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#7a1224", fontWeight: 700 }}>Pay {amountStr} via UPI</p>
                  <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 800, color: "#3a0613" }}>{UPI_ID}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#8a6f75" }}>Open any UPI app and pay to the above UPI ID</p>
                </div>
              </div>

              <div className="ef-payment-upi-section">
                <div className="ef-payment-upi-row">
                  <span className="ef-payment-label">UPI ID:</span>
                  <span className="ef-payment-value">{UPI_ID}</span>
                  <button 
                    className="ef-btn ef-btn--sm ef-btn--ghost" 
                    onClick={handleCopyUPI}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="ef-payment-apps">
                <div className="ef-payment-app-item">
                  <span className="ef-payment-app-icon">📱</span>
                  <div className="ef-payment-app-details">
                    <span className="ef-payment-app-name">PhonePe</span>
                    <span className="ef-payment-app-number">{PHONE_PAY_NUMBER}</span>
                  </div>
                </div>
                <div className="ef-payment-app-item">
                  <span className="ef-payment-app-icon">📱</span>
                  <div className="ef-payment-app-details">
                    <span className="ef-payment-app-name">Google Pay</span>
                    <span className="ef-payment-app-number">{GOOGLE_PAY_NUMBER}</span>
                  </div>
                </div>
              </div>

              <div className="ef-payment-divider">
                <span>OR</span>
              </div>

              <div className="ef-payment-form">
                <div className="ef-payment-field">
                  <label className="ef-field__label">
                    <span className="ef-field__asterisk">*</span>Transaction ID
                  </label>
                  <input
                    type="text"
                    className="ef-input"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter transaction ID from your UPI app"
                  />
                </div>

                <div className="ef-payment-field">
                  <label className="ef-field__label">
                    <span className="ef-field__asterisk">*</span>Upload Payment Screenshot
                  </label>
                  <div className="ef-payment-upload">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="ef-payment-file-input"
                    />
                    {screenshotPreview ? (
                      <div className="ef-payment-preview">
                        <img src={screenshotPreview} alt="Screenshot preview" />
                        <button 
                          className="ef-payment-preview-remove"
                          onClick={() => {
                            setScreenshot(null);
                            setScreenshotPreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="ef-payment-upload-placeholder">
                        <span className="ef-payment-upload-icon">📷</span>
                        <p>Click to upload screenshot</p>
                        <small>PNG, JPG, JPEG (Max 5MB)</small>
                      </div>
                    )}
                  </div>
                </div>

                {error && <div className="ef-payment-error">{error}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="ef-dialog__footer">
          <button 
            className="ef-btn ef-btn--ghost" 
            onClick={handleClose}
          >
            Cancel
          </button>
          <button 
            className="ef-btn ef-btn--primary" 
            onClick={handleSubmitPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="ef-spinner-wrap">
                <span className="ef-spinner" /> Processing…
              </span>
            ) : (
              'Submit Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------- */
/* Step components                                                          */
/* ----------------------------------------------------------------------- */

const PersonalStep = ({ data, errors, onChange }) => (
  <div className="ef-grid">
    <FieldText label="First Name" required value={data.firstName} onChange={onChange('firstName')} error={errors.firstName} />
    <FieldText label="Middle Name" value={data.middleName} onChange={onChange('middleName')} />

    <FieldText label="Last Name" required value={data.lastName} onChange={onChange('lastName')} error={errors.lastName} />
    <FieldText label="Email (used for login)" required value={data.email} onChange={onChange('email')} error={errors.email} />
    <FieldText label="Mobile Number" required value={data.mobile} onChange={onChange('mobile')} error={errors.mobile} />
    <FieldSplit label="Date of Birth (18+ only)" required error={errors.dob}>
      <select className="ef-select ef-select--sm" value={data.dobDay} onChange={onChange('dobDay')}>
        <option value="">DD</option>
        {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select className="ef-select ef-select--sm" value={data.dobMonth} onChange={onChange('dobMonth')}>
        <option value="">MM</option>
        {MONTH_OPTIONS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
      </select>
      <select className="ef-select ef-select--sm" value={data.dobYear} onChange={onChange('dobYear')}>
        <option value="">YYYY</option>
        {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
    </FieldSplit>

    <FieldSelect label="Sub Cast" value={data.subCaste} onChange={onChange('subCaste')} options={SUB_CASTE_OPTIONS} />
    <FieldSelect label="Marital Status" required value={data.maritalStatus} onChange={onChange('maritalStatus')} options={MARITAL_STATUS_OPTIONS} error={errors.maritalStatus} />

    <FieldSplit label="Height">
      <select className="ef-select ef-select--sm" value={data.heightFeet} onChange={onChange('heightFeet')}>
        <option value="">ft</option>
        {HEIGHT_FEET_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
      </select>
      <select className="ef-select ef-select--sm" value={data.heightInches} onChange={onChange('heightInches')}>
        <option value="">in</option>
        {HEIGHT_INCH_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
      </select>
    </FieldSplit>
    <FieldSelect label="Weight" value={data.weight} onChange={onChange('weight')} options={WEIGHT_OPTIONS} />

    <FieldSelect label="Blood Group" value={data.bloodGroup} onChange={onChange('bloodGroup')} options={BLOOD_GROUP_OPTIONS} />
    <FieldSelect label="Complexion" value={data.complexion} onChange={onChange('complexion')} options={COMPLEXION_OPTIONS} />

    <FieldSelect label="Physical Disabilities" value={data.physicalDisability} onChange={onChange('physicalDisability')} options={YES_NO_OPTIONS} />
    <FieldText
      label="If Yes, Please Specify"
      value={data.disabilityDetails}
      onChange={onChange('disabilityDetails')}
      disabled={data.physicalDisability !== 'Yes'}
      placeholder={data.physicalDisability === 'Yes' ? 'Please specify' : 'N/A'}
    />

    <FieldSelect label="Diet" value={data.diet} onChange={onChange('diet')} options={DIET_OPTIONS} placeholder="N/A" />
    <FieldSelect label="Spectacles" value={data.spectacles} onChange={onChange('spectacles')} options={YES_NO_OPTIONS} />
  </div>
);

const HoroscopeStep = ({ data, errors, onChange }) => (
  <div className="ef-grid">
    <FieldSelect label="Rashi" value={data.rashi} onChange={onChange('rashi')} options={RASHI_OPTIONS} />
    <FieldSelect label="Nakshatra" value={data.nakshatra} onChange={onChange('nakshatra')} options={NAKSHATRA_OPTIONS} />

    <FieldSelect label="Charan / Pada" value={data.charan} onChange={onChange('charan')} options={CHARAN_OPTIONS} />
    <FieldSelect label="Gan" value={data.gan} onChange={onChange('gan')} options={GAN_OPTIONS} />

    <FieldText label="Gotra" value={data.gotra} onChange={onChange('gotra')} placeholder="e.g. Kashyap" />
    <FieldSelect label="Manglik" value={data.manglik} onChange={onChange('manglik')} options={MANGLIK_OPTIONS} />

    <FieldText label="Birth Time" type="time" value={data.birthTime} onChange={onChange('birthTime')} />
    <FieldText label="Birth Place" value={data.birthPlace} onChange={onChange('birthPlace')} placeholder="City of birth" />
  </div>
);

const EducationStep = ({ data, errors, onChange }) => (
  <div className="ef-grid">
    <FieldSelect label="Highest Education" required value={data.highestEducation} onChange={onChange('highestEducation')} options={EDUCATION_OPTIONS} error={errors.highestEducation} />
    <FieldText label="Field of Study" value={data.fieldOfStudy} onChange={onChange('fieldOfStudy')} placeholder="e.g. Computer Engineering" />

    <FieldText label="College / Institution" value={data.institution} onChange={onChange('institution')} />
    <FieldSelect label="Occupation" required value={data.occupation} onChange={onChange('occupation')} options={OCCUPATION_OPTIONS} error={errors.occupation} />

    <FieldText label="Employer / Company" value={data.employer} onChange={onChange('employer')} />
    <FieldSelect label="Annual Income" value={data.annualIncome} onChange={onChange('annualIncome')} options={INCOME_OPTIONS} />
  </div>
);

const AddressStep = ({ data, errors, onChange }) => (
  <div className="ef-grid">
    <FieldText label="Country" value={data.country} onChange={onChange('country')} disabled />
    <FieldSelect label="State" required value={data.state} onChange={onChange('state')} options={STATE_OPTIONS} error={errors.state} />

    <FieldText label="City" required value={data.city} onChange={onChange('city')} error={errors.city} />
    <FieldText label="Pincode" value={data.pincode} onChange={onChange('pincode')} maxLength={6} error={errors.pincode} placeholder="6-digit pincode" />

    <FieldTextArea label="Permanent Address" required value={data.permanentAddress} onChange={onChange('permanentAddress')} error={errors.permanentAddress} />

    <div className="ef-field ef-field--full ef-checkbox-row">
      <label className="ef-checkbox">
        <input type="checkbox" checked={data.sameAsPermanent} onChange={onChange('sameAsPermanent')} />
        Current address is same as permanent address
      </label>
    </div>

    {!data.sameAsPermanent && (
      <FieldTextArea label="Current Address" value={data.currentAddress} onChange={onChange('currentAddress')} />
    )}
  </div>
);

const FamilyStep = ({ data, errors, onChange }) => (
  <div className="ef-grid">
    <FieldText label="Father's Name" required value={data.fatherName} onChange={onChange('fatherName')} error={errors.fatherName} />
    <FieldText label="Father's Occupation" value={data.fatherOccupation} onChange={onChange('fatherOccupation')} />

    <FieldText label="Mother's Name" required value={data.motherName} onChange={onChange('motherName')} error={errors.motherName} />
    <FieldText label="Mother's Occupation" value={data.motherOccupation} onChange={onChange('motherOccupation')} />

    <FieldSelect label="No. of Siblings" value={data.siblings} onChange={onChange('siblings')} options={SIBLING_OPTIONS} />
    <FieldSelect label="Family Type" value={data.familyType} onChange={onChange('familyType')} options={FAMILY_TYPE_OPTIONS} />

    <FieldSelect label="Family Status" value={data.familyStatus} onChange={onChange('familyStatus')} options={FAMILY_STATUS_OPTIONS} />
  </div>
);

const ExpectationStep = ({ data, errors, onChange }) => (
  <div className="ef-grid">
    <FieldSplit label="Expected Age Range" required error={errors.age}>
      <select className="ef-select ef-select--sm" value={data.ageFrom} onChange={onChange('ageFrom')}>
        <option value="">From</option>
        {AGE_RANGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <select className="ef-select ef-select--sm" value={data.ageTo} onChange={onChange('ageTo')}>
        <option value="">To</option>
        {AGE_RANGE_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
    </FieldSplit>

    <FieldSplit label="Expected Height Range">
      <select className="ef-select ef-select--sm" value={data.heightFrom} onChange={onChange('heightFrom')}>
        <option value="">From</option>
        {HEIGHT_RANGE_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <select className="ef-select ef-select--sm" value={data.heightTo} onChange={onChange('heightTo')}>
        <option value="">To</option>
        {HEIGHT_RANGE_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
    </FieldSplit>

    <FieldSelect label="Expected Education" value={data.education} onChange={onChange('education')} options={EDUCATION_OPTIONS} />
    <FieldSelect label="Expected Occupation" value={data.occupation} onChange={onChange('occupation')} options={OCCUPATION_OPTIONS} />

    <FieldText label="Preferred Location" value={data.location} onChange={onChange('location')} placeholder="City / State" />

    <FieldTextArea label="Other Preferences" value={data.otherPreferences} onChange={onChange('otherPreferences')} placeholder="Anything else you're looking for in a match" rows={4} />
  </div>
);

/* ----------------------------------------------------------------------- */
/* Stepper                                                                  */
/* ----------------------------------------------------------------------- */

const Stepper = ({ current, labels, onStepClick }) => (
  <div className="ef-stepper">
    {labels.map((label, idx) => {
      const stepNum = idx + 1;
      const state = stepNum === current ? 'active' : stepNum < current ? 'done' : 'pending';
      return (
        <React.Fragment key={label}>
          <button
            type="button"
            className={`ef-step ef-step--${state}`}
            onClick={() => stepNum < current && onStepClick(stepNum)}
            disabled={stepNum >= current}
          >
            <span className="ef-step__circle">{stepNum < current ? '✓' : stepNum}</span>
            <span className="ef-step__label">{label}</span>
          </button>
          {idx < labels.length - 1 && <span className={`ef-step__line${stepNum < current ? ' ef-step__line--done' : ''}`} />}
        </React.Fragment>
      );
    })}
  </div>
);

/* ----------------------------------------------------------------------- */
/* Validation                                                               */
/* ----------------------------------------------------------------------- */

const calculateAge = (day, month, year) => {
  if (!day || !month || !year) return null;
  const dob = new Date(Number(year), Number(month) - 1, Number(day));
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;
};

const validateStep = (step, formData) => {
  const errors = {};

  if (step === 1) {
    const p = formData.personal;
    if (!p.firstName.trim()) errors.firstName = 'First name is required.';
    if (!p.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!p.email || !p.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) {
      errors.email = 'Please enter a valid email.';
    }
    if (!p.mobile || !p.mobile.trim()) {
      errors.mobile = 'Mobile number is required.';
    } else if (!/^[0-9]{10}$/.test(p.mobile.trim())) {
      errors.mobile = 'Enter a valid 10-digit mobile number.';
    }
    if (!p.dobDay || !p.dobMonth || !p.dobYear) {
      errors.dob = 'Please select your complete date of birth.';
    } else {
      const age = calculateAge(p.dobDay, p.dobMonth, p.dobYear);
      if (age === null || age < 18) {
        errors.dob = 'You must be 18 years or older to register.';
      }
    }
    if (!p.maritalStatus) errors.maritalStatus = 'Please select marital status.';
  }

  if (step === 3) {
    const e = formData.education;
    if (!e.highestEducation) errors.highestEducation = 'Please select highest education.';
    if (!e.occupation) errors.occupation = 'Please select occupation.';
  }

  if (step === 4) {
    const a = formData.address;
    if (!a.state) errors.state = 'Please select a state.';
    if (!a.city.trim()) errors.city = 'City is required.';
    if (a.pincode && !/^\d{6}$/.test(a.pincode)) errors.pincode = 'Pincode must be 6 digits.';
    if (!a.permanentAddress.trim()) errors.permanentAddress = 'Permanent address is required.';
  }

  if (step === 5) {
    const f = formData.family;
    if (!f.fatherName.trim()) errors.fatherName = "Father's name is required.";
    if (!f.motherName.trim()) errors.motherName = "Mother's name is required.";
  }

  if (step === 6) {
    const x = formData.expectation;
    if (!x.ageFrom || !x.ageTo) {
      errors.age = 'Please select an expected age range.';
    } else if (Number(x.ageFrom) > Number(x.ageTo)) {
      errors.age = '"From" age cannot be greater than "To" age.';
    }
  }

  return errors;
};

/* ----------------------------------------------------------------------- */
/* Main component                                                           */
/* ----------------------------------------------------------------------- */

const Registration = () => {
  const dispatch = useDispatch();
  const { 
    step, 
    totalSteps, 
    formData, 
    status,
    error,
    successMessage,
    registrationCode,
    paymentStatus,
    paymentError,
    paymentData,
  } = useSelector((state) => state.registration);
  
  const [stepErrors, setStepErrors] = useState({});
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const handleChange = (section, field) => (e) => {
    const { value, type, checked } = e.target;
    dispatch(updateField({ section, field, value: type === 'checkbox' ? checked : value }));
  };

  const goNext = () => {
    const errors = validateStep(step, formData);
    setStepErrors(errors);
    if (Object.keys(errors).length === 0) {
      // On leaving the Personal step, save a draft to registrations_temp
      // (best-effort; never blocks navigation). Removed on full registration.
      if (step === 1) {
        fetch("/api/registration/temp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ personal: formData.personal }),
        }).catch(() => { /* ignore draft-save errors */ });
      }
      dispatch(nextStep());
    }
  };

  const goPrev = () => {
    setStepErrors({});
    dispatch(prevStep());
  };

  const handleStepperClick = (target) => {
    setStepErrors({});
    dispatch(goToStep(target));
  };

  const handlePaymentSubmit = async (paymentData) => {
    setIsPaymentLoading(true);
    try {
      // First, submit the registration if not already submitted, and capture
      // the generated registration code so the payment links to it.
      let regCode = registrationCode;
      if (status !== 'succeeded') {
        const result = await dispatch(submitRegistration(formData)).unwrap();
        regCode = result.registrationCode || result.id;
      }

      // Then submit payment, referencing the real registration code.
      await dispatch(submitPayment({
        ...paymentData,
        registrationId: regCode,
      })).unwrap();

      setIsPaymentDialogOpen(false);
      setIsPaymentLoading(false);
    } catch (err) {
      setIsPaymentLoading(false);
      alert('Payment submission failed. Please try again.');
    }
  };

  // FIXED: This function now properly opens the payment dialog
  const handleSubmit = () => {
    const errors = validateStep(step, formData);
    setStepErrors(errors);
    if (Object.keys(errors).length === 0) {
      // Open payment dialog
      setIsPaymentDialogOpen(true);
    }
  };

  const handleStartOver = () => {
    setStepErrors({});
    dispatch(resetForm());
  };

  const stepComponents = {
    1: <PersonalStep data={formData.personal} errors={stepErrors} onChange={(f) => handleChange('personal', f)} />,
    2: <HoroscopeStep data={formData.horoscope} errors={stepErrors} onChange={(f) => handleChange('horoscope', f)} />,
    3: <EducationStep data={formData.education} errors={stepErrors} onChange={(f) => handleChange('education', f)} />,
    4: <AddressStep data={formData.address} errors={stepErrors} onChange={(f) => handleChange('address', f)} />,
    5: <FamilyStep data={formData.family} errors={stepErrors} onChange={(f) => handleChange('family', f)} />,
    6: <ExpectationStep data={formData.expectation} errors={stepErrors} onChange={(f) => handleChange('expectation', f)} />,
  };

  // Success screen after payment
  if (status === 'succeeded' && paymentStatus === 'succeeded') {
    return (
      <div className="ef-page">
        <div className="ef-brandbar">
          <span className="ef-brandbar__icon">♥</span>
        </div>
        <div className="ef-card ef-card--success">
          <div className="ef-success__icon">✓</div>
          <h2 className="ef-success__title">Registration Submitted!</h2>

          {/* Prominent Registration ID */}
          <div style={{
            margin: '18px auto',
            maxWidth: 420,
            background: '#fdf3da',
            border: '2px dashed #b8860b',
            borderRadius: 12,
            padding: '18px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: '#7a1224', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
              Your Registration ID
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, color: '#3a0613', letterSpacing: '0.05em', margin: '6px 0' }}>
              {registrationCode || paymentData?.registrationId || 'N/A'}
            </div>
            <div style={{ fontSize: 13, color: '#8a6f75' }}>
              Please save this ID — you will need it (with your email) to log in.
            </div>
          </div>

          <p className="ef-success__text" style={{ color: '#b8860b', fontWeight: 600 }}>
            Your payment is pending verification by our admin. You can log in once it has been approved.
          </p>

          <div className="ef-payment-receipt">
            <p><strong>Transaction ID:</strong> {paymentData?.transactionId || 'N/A'}</p>
            <p><strong>Payment Status:</strong> Pending admin verification</p>
            <p><strong>Amount:</strong> ₹1,000</p>
          </div>
          <button type="button" className="ef-btn ef-btn--primary" onClick={handleStartOver}>
            Register Another Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ef-page">
      <div className="ef-brandbar">
      </div>

      <div className="ef-card">
        <div className="ef-card__header">
          <h1 className="ef-title">
            Enroll Form <span className="ef-title__note">(Only users aged 18 years and above can register.)</span>
          </h1>
        </div>

        <Stepper current={step} labels={STEP_LABELS} onStepClick={handleStepperClick} />

        <div className="ef-section-title">{STEP_LABELS[step - 1]} Details</div>
        <div className="ef-divider" />

        {status === 'failed' && error && (
          <div className="ef-banner ef-banner--error">
            <span>{error}</span>
            <button type="button" className="ef-banner__close" onClick={() => dispatch(clearSubmissionStatus())}>×</button>
          </div>
        )}

        {paymentStatus === 'failed' && paymentError && (
          <div className="ef-banner ef-banner--error">
            <span>{paymentError}</span>
            <button type="button" className="ef-banner__close" onClick={() => dispatch(resetPaymentStatus())}>×</button>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {stepComponents[step]}

          <div className="ef-actions">
            <button
              type="button"
              className="ef-btn ef-btn--ghost"
              onClick={goPrev}
              disabled={step === 1}
            >
              Previous
            </button>

            {step < totalSteps ? (
              <button type="button" className="ef-btn ef-btn--primary" onClick={goNext}>
                Next
              </button>
            ) : (
              <button
                type="button"
                className="ef-btn ef-btn--primary ef-btn--payment"
                onClick={handleSubmit}
                disabled={status === 'loading' || paymentStatus === 'loading'}
              >
                {status === 'loading' || paymentStatus === 'loading' ? (
                  <span className="ef-spinner-wrap">
                    <span className="ef-spinner" /> Processing…
                  </span>
                ) : (
                  'Proceed to Payment'
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Payment Dialog - This will now show when isPaymentDialogOpen is true */}
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onPaymentSubmit={handlePaymentSubmit}
        isLoading={isPaymentLoading}
      />
    </div>
  );
};

export default Registration;