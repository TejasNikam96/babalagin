import React, { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ---- Dropdown option lists (swap these for your real data / API results) ----

const ageOptions = Array.from({ length: 43 }, (_, i) => String(18 + i)); // 18 - 60

const heightOptions = (() => {
  const list = [];
  for (let feet = 4; feet <= 6; feet++) {
    for (let inch = 0; inch <= 11; inch++) {
      if (feet === 6 && inch > 6) break;
      list.push(`${feet}'${String(inch).padStart(2, "0")}"`);
    }
  }
  return list;
})();

const educationOptions = [
  "Below SSC",
  "SSC",
  "HSC",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "Doctorate / Ph.D",
  "Other",
];

const occupationTypeOptions = [
  "Govt Service",
  "Private Service",
  "Business",
  "Self Employed",
  "Professional",
  "Not Working",
  "Other",
];

const cityOptions = [
  "A.NAGAR",
  "AMRAVATI",
  "AURANGABAD",
  "BEED",
  "BHANDARA",
  "BULDHANA",
  "CHANDRAPUR",
  "DHULE",
  "JALGAON",
  "JALNA",
  "KOLHAPUR",
  "LATUR",
  "MUMBAI",
  "NAGPUR",
  "NANDED",
  "NASHIK",
  "OSMANABAD",
  "PALGHAR",
  "PUNE",
  "RAIGAD",
  "RATNAGIRI",
  "SANGLI",
  "SATARA",
  "SOLAPUR",
  "THANE",
  "WARDHA",
  "YAVATMAL",
];

const incomeOptions = [
  "Below 2 Lakh",
  "2 - 4 Lakh",
  "4 - 8 Lakh",
  "8 - 16 Lakh",
  "16 - 25 Lakh",
  "25 Lakh & Above",
];

const initialFormData = {
  gender: "Female",
  maritalStatus: "Unmarried",
  ageFrom: "20",
  ageTo: "35",
  heightFrom: "",
  heightTo: "",
  mangalik: false,
  education: "",
  occupationType: "",
  occupationPlace: "",
  incomeRange: "",
  nativePlace: "",
};

// ---- Reusable field components ----

function RadioGroup({ label, name, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-800 mb-2.5">
        {label}
      </label>
      <div className="flex items-center gap-6">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-800 mb-2.5">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-white border border-gray-300 rounded-sm px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-shadow"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
      </div>
    </div>
  );
}

function CheckboxField({ sectionLabel, label, name, checked, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-800 mb-2.5">
        {sectionLabel}
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 accent-blue-600 rounded-sm cursor-pointer"
        />
        {label}
      </label>
    </div>
  );
}

// ---- Main page ----

export default function MatchingSearch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const parseHeight = (h) => {
    const m = /^(\d+)'(\d+)/.exec(h || "");
    return m ? Number(m[1]) * 12 + Number(m[2]) : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map this form's fields onto the profile-search API and show results.
    const params = new URLSearchParams();
    // Gender (Male/Female) -> profile gender stored as Groom/Bride.
    if (formData.gender) params.set("lookingFor", formData.gender === "Male" ? "Groom" : "Bride");
    // Marital status (Divorcee -> Divorced to match stored values).
    if (formData.maritalStatus) {
      params.set("maritalStatus", formData.maritalStatus === "Divorcee" ? "Divorced" : formData.maritalStatus);
    }
    if (formData.ageFrom) params.set("ageFrom", formData.ageFrom);
    if (formData.ageTo) params.set("ageTo", formData.ageTo);

    const hFrom = parseHeight(formData.heightFrom);
    const hTo = parseHeight(formData.heightTo);
    if (hFrom != null) params.set("heightFromInches", hFrom);
    if (hTo != null) params.set("heightToInches", hTo);

    if (formData.mangalik) params.set("mangalik", "Yes");
    if (formData.education) params.set("education", formData.education);
    if (formData.occupationType) params.set("occupationType", formData.occupationType);
    if (formData.occupationPlace) params.set("location", formData.occupationPlace);
    if (formData.incomeRange) params.set("incomeRange", formData.incomeRange);
    if (formData.nativePlace) params.set("nativePlace", formData.nativePlace);

    navigate(`/search/results?${params.toString()}`);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 px-6 py-8 sm:px-10 sm:py-10">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800">
          Matching <span className="text-slate-400 font-normal">/</span>{" "}
          Simple Search
        </h1>
        <hr className="mt-4 mb-8 border-gray-200" />

        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
            <RadioGroup
              label="Gender"
              name="gender"
              options={["Male", "Female"]}
              value={formData.gender}
              onChange={handleChange}
            />
            <RadioGroup
              label="Marital Status"
              name="maritalStatus"
              options={["Unmarried", "Divorcee"]}
              value={formData.maritalStatus}
              onChange={handleChange}
            />

            <SelectField
              label="Age From"
              name="ageFrom"
              value={formData.ageFrom}
              onChange={handleChange}
              options={ageOptions}
              placeholder="From"
            />
            <SelectField
              label="Age To"
              name="ageTo"
              value={formData.ageTo}
              onChange={handleChange}
              options={ageOptions}
              placeholder="To"
            />

            <SelectField
              label="Height From"
              name="heightFrom"
              value={formData.heightFrom}
              onChange={handleChange}
              options={heightOptions}
              placeholder="From"
            />
            <SelectField
              label="Height To"
              name="heightTo"
              value={formData.heightTo}
              onChange={handleChange}
              options={heightOptions}
              placeholder="To"
            />
          </div>

          <CheckboxField
            sectionLabel="Mangalik"
            label="Mangalik"
            name="mangalik"
            checked={formData.mangalik}
            onChange={handleChange}
          />

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
            <SelectField
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              options={educationOptions}
              placeholder="Select Education"
            />
            <SelectField
              label="Occupation Type"
              name="occupationType"
              value={formData.occupationType}
              onChange={handleChange}
              options={occupationTypeOptions}
              placeholder="Select Occupation"
            />

            <SelectField
              label="Occupation Place"
              name="occupationPlace"
              value={formData.occupationPlace}
              onChange={handleChange}
              options={cityOptions}
              placeholder="Select City"
            />
            <SelectField
              label="Income Range Per Annum"
              name="incomeRange"
              value={formData.incomeRange}
              onChange={handleChange}
              options={incomeOptions}
              placeholder="Select Range"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
            <SelectField
              label="Native Place"
              name="nativePlace"
              value={formData.nativePlace}
              onChange={handleChange}
              options={cityOptions}
              placeholder="Select City"
            />
            <div />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#ffdf7e] to-[#f0b429] text-[#3a0613] font-bold py-3 rounded-sm shadow-lg hover:shadow-xl transition-all"
            >
              Submit Form
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gradient-to-b from-[#ffdf7e] to-[#f0b429] text-[#3a0613] font-bold py-3 rounded-sm shadow-lg hover:shadow-xl transition-all"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>

      {/* Floating chat button */}
      <button
        type="button"
        aria-label="Chat with us"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-b from-[#a0552c] to-[#7a3f1f] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}