import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

type InfoBoxProps = {
  title: string;
  children: React.ReactNode;
};

const InfoBox = ({ title, children }: InfoBoxProps) => (
  <div className="border border-green-400 bg-green-50 rounded-lg p-5 text-sm text-gray-700">
    <h3 className="font-semibold mb-2 text-gray-800">{title}</h3>
    <p>{children}</p>
  </div>
);

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  type?: "text" | "number";
  placeholder?: string;
};

const TextInput = ({
  label,
  value,
  onChange,
  readOnly = false,
  type = "text",
  placeholder,
}: TextInputProps) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      step={type === "number" ? "any" : undefined}
      className="w-full border rounded-md px-3 py-2 text-sm"
    />
  </div>
);

type SelectInputProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const SelectInput = ({ label, options, value, onChange }: SelectInputProps) => (
  <div className="w-full">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      className="w-full border rounded-md px-3 py-2 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

type RadioOption = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
};

const RadioGroup = ({
  label,
  options,
  selectedValue,
  onChange,
}: RadioGroupProps) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="flex gap-4 mt-1">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-1 text-sm">
          <input
            type="radio"
            name={label}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onChange(option.value)}
            className="accent-green-500"
          />
          {option.label}
        </label>
      ))}
    </div>
  </div>
);

type ShopStandardsFormData = {
  measurementUnit: string;
  presetName: string;
  projectName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  doorType: string;
  sidesMaterial: string;
  baseCabinetHeight: string;
  baseCabinetDepth: string;
  topCabinetHeight: string;
  topCabinetDepth: string;
  tallCabinetHeight: string;
  tallCabinetDepth: string;
  kickHeight: string;
  kickDepth: string;
  constructionMethod: string;
  shelfEdgeband: string;
  topDrawerHeight: string;
  drawerStyle: string;
};

type PresetItem = {
  presetId: string;
  name: string;
  measurementUnit?: string;
  projectName?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  doorType?: string;
  sidesMaterial?: string;
  baseCabinetHeight?: number | string;
  baseCabinetDepth?: number | string;
  topCabinetHeight?: number | string;
  topCabinetDepth?: number | string;
  tallCabinetHeight?: number | string;
  tallCabinetDepth?: number | string;
  kickHeight?: number | string;
  kickDepth?: number | string;
  constructionMethod?: string;
  shelfEdgeband?: string;
  topDrawerHeight?: number | string;
  drawerStyle?: string;
};

const initialFormData: ShopStandardsFormData = {
  measurementUnit: "Imperial",
  presetName: "",
  projectName: "",
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  doorType: "NOT Supplied",
  sidesMaterial: "Select Material",
  baseCabinetHeight: "34.5",
  baseCabinetDepth: "24",
  topCabinetHeight: "42",
  topCabinetDepth: "12",
  tallCabinetHeight: "80",
  tallCabinetDepth: "24",
  kickHeight: "4",
  kickDepth: "24",
  constructionMethod: "LamelloTenso-3mm Pilot Holes",
  shelfEdgeband: "Match Front",
  topDrawerHeight: "6",
  drawerStyle: "Flat",
};

const numericFields = [
  "baseCabinetHeight",
  "baseCabinetDepth",
  "topCabinetHeight",
  "topCabinetDepth",
  "tallCabinetHeight",
  "tallCabinetDepth",
  "kickHeight",
  "kickDepth",
  "topDrawerHeight",
] as const;

type NumericField = (typeof numericFields)[number];

const toInputValue = (value: unknown, fallback = "") =>
  value === undefined || value === null ? fallback : String(value);

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function ShopStandards() {
  const navigate = useNavigate();
  const auth = useAuth();

  const SAVE_PRESET_URL = import.meta.env.VITE_SAVE_PRESET_URL;
  const GET_PRESETS_URL = import.meta.env.VITE_GET_PRESETS;

  const [formData, setFormData] = useState<ShopStandardsFormData>(initialFormData);
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.presetId === selectedPresetId),
    [presets, selectedPresetId]
  );

  useEffect(() => {
    const saved = localStorage.getItem("shopStandards");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<ShopStandardsFormData>;
      setFormData({ ...initialFormData, ...parsed });
    } catch (error) {
      console.error("Failed to parse local shopStandards:", error);
    }
  }, []);

  useEffect(() => {
    const loadPresets = async () => {
      const token = auth.user?.access_token;
      if (!token || !GET_PRESETS_URL) return;

      try {
        setIsLoadingPresets(true);

        const response = await fetch(GET_PRESETS_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load presets");
        }

        setPresets(Array.isArray(data?.presets) ? data.presets : []);
      } catch (error) {
        console.error("Failed to load presets:", error);
      } finally {
        setIsLoadingPresets(false);
      }
    };

    loadPresets();
  }, [auth.user?.access_token, GET_PRESETS_URL]);

  const handleChange = <K extends keyof ShopStandardsFormData>(
    key: K,
    value: ShopStandardsFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const applyPresetToForm = (preset: PresetItem) => {
    setFormData((prev) => ({
      ...prev,
      presetName: preset.name ?? "",
      measurementUnit: preset.measurementUnit ?? prev.measurementUnit,
      projectName: preset.projectName ?? "",
      customerName: preset.customerName ?? "",
      customerPhone: preset.customerPhone ?? "",
      customerAddress: preset.customerAddress ?? "",
      doorType: preset.doorType ?? prev.doorType,
      sidesMaterial: preset.sidesMaterial ?? prev.sidesMaterial,
      baseCabinetHeight: toInputValue(preset.baseCabinetHeight, prev.baseCabinetHeight),
      baseCabinetDepth: toInputValue(preset.baseCabinetDepth, prev.baseCabinetDepth),
      topCabinetHeight: toInputValue(preset.topCabinetHeight, prev.topCabinetHeight),
      topCabinetDepth: toInputValue(preset.topCabinetDepth, prev.topCabinetDepth),
      tallCabinetHeight: toInputValue(preset.tallCabinetHeight, prev.tallCabinetHeight),
      tallCabinetDepth: toInputValue(preset.tallCabinetDepth, prev.tallCabinetDepth),
      kickHeight: toInputValue(preset.kickHeight, prev.kickHeight),
      kickDepth: toInputValue(preset.kickDepth, prev.kickDepth),
      constructionMethod: preset.constructionMethod ?? prev.constructionMethod,
      shelfEdgeband: preset.shelfEdgeband ?? prev.shelfEdgeband,
      topDrawerHeight: toInputValue(preset.topDrawerHeight, prev.topDrawerHeight),
      drawerStyle: preset.drawerStyle ?? prev.drawerStyle,
    }));
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);

    if (!presetId) {
      setFormData(initialFormData);
      return;
    }

    const selected = presets.find((preset) => preset.presetId === presetId);
    if (selected) applyPresetToForm(selected);
  };

  const buildPayload = () => {
    const payload = {
      presetId: selectedPresetId || undefined,
      name: formData.presetName.trim(),
      presetType: "shop-standards",
      measurementUnit: formData.measurementUnit,
      projectName: formData.projectName,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      doorType: formData.doorType,
      sidesMaterial: formData.sidesMaterial,
      constructionMethod: formData.constructionMethod,
      shelfEdgeband: formData.shelfEdgeband,
      drawerStyle: formData.drawerStyle,
    } as Record<string, string | number | undefined>;

    numericFields.forEach((field) => {
      payload[field] = toNumber(formData[field]);
    });

    return payload;
  };

  const handleSubmit = async () => {
    const token = auth.user?.access_token;

    if (!token) {
      alert("You must be logged in to save a preset.");
      return;
    }

    if (!SAVE_PRESET_URL) {
      alert("Missing VITE_SAVE_PRESET_URL");
      return;
    }

    if (!formData.presetName.trim()) {
      alert("Preset Name is required.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = buildPayload();

      const response = await fetch(SAVE_PRESET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save preset");
      }

      localStorage.setItem("shopStandards", JSON.stringify(formData));
      navigate("/builder");
    } catch (error) {
      console.error("Save preset failed:", error);
      alert(error instanceof Error ? error.message : "Failed to save preset");
    } finally {
      setIsSaving(false);
    }
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
        <div>
          <label className="block text-sm font-medium mb-1">
            Load Existing Preset
          </label>
          <select
            className="w-full border rounded-md px-3 py-2 text-sm"
            value={selectedPresetId}
            onChange={(e) => handlePresetSelect(e.target.value)}
            disabled={isLoadingPresets}
          >
            <option value="">
              {isLoadingPresets ? "Loading presets..." : "Start new preset"}
            </option>
            {presets.map((preset) => (
              <option key={preset.presetId} value={preset.presetId}>
                {preset.name}
              </option>
            ))}
          </select>
          {selectedPreset && (
            <p className="text-xs text-gray-500 mt-1">
              Editing existing preset: {selectedPreset.name}
            </p>
          )}
        </div>

        <RadioGroup
          label="Choose Your Preferred Measurement Unit"
          options={[
            { label: "Imperial", value: "Imperial" },
            { label: "Metric", value: "Metric" },
          ]}
          selectedValue={formData.measurementUnit}
          onChange={(value) => handleChange("measurementUnit", value)}
        />

        <TextInput
          label="Preset Name"
          value={formData.presetName}
          onChange={(value) => handleChange("presetName", value)}
        />

        <div className="border rounded p-4 space-y-4">
          <TextInput
            label="Project Name"
            value={formData.projectName}
            onChange={(value) => handleChange("projectName", value)}
          />

          <TextInput
            label="Customer Name"
            value={formData.customerName}
            onChange={(value) => handleChange("customerName", value)}
          />

          <TextInput
            label="Customer Phone Number"
            value={formData.customerPhone}
            onChange={(value) => handleChange("customerPhone", value)}
          />

          <TextInput
            label="Customer Address"
            value={formData.customerAddress}
            onChange={(value) => handleChange("customerAddress", value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Door / Fronts Type"
            options={["NOT Supplied", "Flat", "SFP"]}
            value={formData.doorType}
            onChange={(value) => handleChange("doorType", value)}
          />

          <SelectInput
            label="Cabinet Material"
            options={["Select Material", "3/4 Melamine", "3/4 Plywood"]}
            value={formData.sidesMaterial}
            onChange={(value) => handleChange("sidesMaterial", value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput
            label="Base Cabinet Height"
            type="number"
            value={formData.baseCabinetHeight}
            onChange={(value) => handleChange("baseCabinetHeight", value)}
          />
          <TextInput
            label="Base Cabinet Depth"
            type="number"
            value={formData.baseCabinetDepth}
            onChange={(value) => handleChange("baseCabinetDepth", value)}
          />

          <TextInput
            label="Top Cabinet Height"
            type="number"
            value={formData.topCabinetHeight}
            onChange={(value) => handleChange("topCabinetHeight", value)}
          />
          <TextInput
            label="Top Cabinet Depth"
            type="number"
            value={formData.topCabinetDepth}
            onChange={(value) => handleChange("topCabinetDepth", value)}
          />

          <TextInput
            label="Tall Cabinet Height"
            type="number"
            value={formData.tallCabinetHeight}
            onChange={(value) => handleChange("tallCabinetHeight", value)}
          />
          <TextInput
            label="Tall Cabinet Depth"
            type="number"
            value={formData.tallCabinetDepth}
            onChange={(value) => handleChange("tallCabinetDepth", value)}
          />

          <TextInput
            label="Kick Height"
            type="number"
            value={formData.kickHeight}
            onChange={(value) => handleChange("kickHeight", value)}
          />
          <TextInput
            label="Kick Depth"
            type="number"
            value={formData.kickDepth}
            onChange={(value) => handleChange("kickDepth", value)}
          />

          <TextInput
            label="Top Drawer Height"
            type="number"
            value={formData.topDrawerHeight}
            onChange={(value) => handleChange("topDrawerHeight", value)}
          />

          <SelectInput
            label="Drawer Style"
            options={["Flat", "Shaker"]}
            value={formData.drawerStyle}
            onChange={(value) => handleChange("drawerStyle", value)}
          />

          {/* <SelectInput
            label="Shelf Edgeband"
            options={["Match Front", "None"]}
            value={formData.shelfEdgeband}
            onChange={(value) => handleChange("shelfEdgeband", value)}
          />

          <SelectInput
            label="Construction Method"
            options={["LamelloTenso-3mm Pilot Holes"]}
            value={formData.constructionMethod}
            onChange={(value) => handleChange("constructionMethod", value)}
          /> */}
        </div>
      </div>

      <div className="flex justify-center mt-8 mb-10">
        <button
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-lg font-semibold transition disabled:opacity-60"
          onClick={handleSubmit}
          type="button"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save and Use Preset"}
        </button>
      </div>
    </div>
  );
}
