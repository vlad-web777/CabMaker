// src/pages/shop-standards.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type InfoBoxProps = {
  title: string;
  children: React.ReactNode;
};
const InfoBox: React.FC<InfoBoxProps> = ({ title, children }) => (
  <div className="border border-green-400 bg-green-50 rounded-lg p-5 text-sm text-gray-700">
    <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
    <p>{children}</p>
  </div>
);

type TextInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};
const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  readOnly = false,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full border rounded-md px-3 py-2 text-sm"
    />
  </div>
);

type SelectInputProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};
const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      className="w-full border rounded-md px-3 py-2 text-sm"
      value={value}
      onChange={onChange}
    >
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

type SliderInputProps = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const SliderInput: React.FC<SliderInputProps> = ({
  label,
  min,
  max,
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full accent-green-500"
      />
      <input
        type="text"
        value={value}
        readOnly
        className="w-16 border rounded-md px-2 py-1 text-sm text-center"
      />
    </div>
  </div>
);

type RadioOption = { label: string; value: string };
type RadioGroupProps = {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};
const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="flex gap-4 mt-1">
      {options.map((opt, idx) => (
        <label key={idx} className="flex items-center gap-1">
          <input
            type="radio"
            name={label}
            value={opt.value}
            checked={selectedValue === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-green-500"
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
);

// Define a strict type for the shop standards form data
type ShopStandardsFormData = {
  measurementUnit: string;
  presetName: string;
  doorType: string;
  sidesMaterial: string;
  constructionMethod: string;
  shelfEdgeband: string;
  topDrawerHeight: number;
  drawerStyle: string;
};

export default function ShopStandards() {
  const navigate = useNavigate();

  const initialFormData: ShopStandardsFormData = {
    measurementUnit: "Imperial",
    presetName: "",
    doorType: "NOT Supplied",
    sidesMaterial: "Select Material",
    constructionMethod: "LamelloTenso-3mm Pilot Holes",
    shelfEdgeband: "Match Front",
    topDrawerHeight: 6,
    drawerStyle: "Flat",
  };

  const [formData, setFormData] = useState<ShopStandardsFormData>(
    initialFormData
  );

  useEffect(() => {
    const saved = localStorage.getItem("shopStandards");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleChange = <K extends keyof ShopStandardsFormData>(
    key: K,
    value: ShopStandardsFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    localStorage.setItem("shopStandards", JSON.stringify(formData));
    navigate("/builder");
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      <InfoBox title="What are Presets?">
        The presets are your defaults or shop standards for your job. Any
        selection you make here will automatically apply to cabinets as you add
        them. You can override presets per cabinet.
      </InfoBox>

      <h1 className="text-2xl font-semibold text-center mt-10 mb-6">
        Choose Option Preset
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
        <RadioGroup
          label="Choose Your Preferred Measurement Unit"
          options={[
            { label: "Imperial", value: "Imperial" },
            { label: "Metric", value: "Metric" },
          ]}
          selectedValue={formData.measurementUnit}
          onChange={(v) => handleChange("measurementUnit", v)}
        />

        <TextInput
          label="Preset Name"
          value={formData.presetName}
          onChange={(e) => handleChange("presetName", e.target.value)}
        />

        <SelectInput
          label="Door / Fronts Type"
          options={["NOT Supplied", "Type A", "Type B"]}
          value={formData.doorType}
          onChange={(e) => handleChange("doorType", e.target.value)}
        />

        <SelectInput
          label="Sides Material"
          options={["Select Material", "Material A", "Material B"]}
          value={formData.sidesMaterial}
          onChange={(e) => handleChange("sidesMaterial", e.target.value)}
        />

        <SelectInput
          label="Construction Method"
          options={["LamelloTenso-3mm Pilot Holes", "Method B"]}
          value={formData.constructionMethod}
          onChange={(e) => handleChange("constructionMethod", e.target.value)}
        />

        <SelectInput
          label="Shelf Edgeband Selection"
          options={["Match Front", "Option B"]}
          value={formData.shelfEdgeband}
          onChange={(e) => handleChange("shelfEdgeband", e.target.value)}
        />

        <SliderInput
          label="Top Drawer Front Height"
          min={3}
          max={10}
          value={formData.topDrawerHeight}
          onChange={(e) =>
            handleChange("topDrawerHeight", Number(e.target.value))
          }
        />

        <RadioGroup
          label="Drawer Style"
          options={[
            { label: "Flat", value: "Flat" },
            { label: "Raised", value: "Raised" },
          ]}
          selectedValue={formData.drawerStyle}
          onChange={(v) => handleChange("drawerStyle", v)}
        />
      </div>

      <div className="flex justify-center mt-8 mb-10">
        <button
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-lg font-semibold transition"
          onClick={handleSubmit}
          type="button"
        >
          Save and Use Preset
        </button>
      </div>
    </div>
  );
}