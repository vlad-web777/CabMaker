import React, { useState, useEffect } from "react";
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
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
};

const TextInput = ({
  label,
  value,
  onChange,
  readOnly = false,
}: TextInputProps) => (
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

const SelectInput = ({
  label,
  options,
  value,
  onChange,
}: SelectInputProps) => (
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

type ShopStandardsFormData = {
  measurementUnit: string;
  presetName: string;
  projectName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  doorType: string;
  sidesMaterial: string;
  baseCabinetHeight: number;
  baseCabinetDepth: number;
  topCabinetHeight: number;
  topCabinetDepth: number;
  tallCabinetHeight: number;
  tallCabinetDepth: number;
  kickHeight: number;
  kickDepth: number;
  constructionMethod: string;
  shelfEdgeband: string;
  topDrawerHeight: number;
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
  baseCabinetHeight?: number;
  baseCabinetDepth?: number;
  topCabinetHeight?: number;
  topCabinetDepth?: number;
  tallCabinetHeight?: number;
  tallCabinetDepth?: number;
  kickHeight?: number;
  kickDepth?: number;
  constructionMethod?: string;
  shelfEdgeband?: string;
  topDrawerHeight?: number;
  drawerStyle?: string;
};

export default function ShopStandards() {
  const navigate = useNavigate();
  const auth = useAuth();

  const SAVE_PRESET_URL = import.meta.env.VITE_SAVE_PRESET_URL;
  const GET_PRESETS_URL = import.meta.env.VITE_GET_PRESETS;

  const initialFormData: ShopStandardsFormData = {
    measurementUnit: "Imperial",
    presetName: "",
    projectName: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    doorType: "NOT Supplied",
    sidesMaterial: "Select Material",
    baseCabinetHeight: 34.5,
    baseCabinetDepth: 24,
    topCabinetHeight: 42,
    topCabinetDepth: 12,
    tallCabinetHeight: 80,
    tallCabinetDepth: 24,
    kickHeight: 4,
    kickDepth: 24,
    constructionMethod: "LamelloTenso-3mm Pilot Holes",
    shelfEdgeband: "Match Front",
    topDrawerHeight: 6,
    drawerStyle: "Flat",
  };

  const [formData, setFormData] = useState<ShopStandardsFormData>(initialFormData);
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shopStandards");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse local shopStandards:", error);
      }
    }
  }, []);

  useEffect(() => {
    const loadPresets = async () => {
      try {
        const token = auth.user?.access_token;
        if (!token || !GET_PRESETS_URL) return;

        setIsLoadingPresets(true);

        const response = await fetch(GET_PRESETS_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("getPresets response:", data);

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
  }, [auth.user, GET_PRESETS_URL]);

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
      baseCabinetHeight: preset.baseCabinetHeight ?? prev.baseCabinetHeight,
      baseCabinetDepth: preset.baseCabinetDepth ?? prev.baseCabinetDepth,
      topCabinetHeight: preset.topCabinetHeight ?? prev.topCabinetHeight,
      topCabinetDepth: preset.topCabinetDepth ?? prev.topCabinetDepth,
      tallCabinetHeight: preset.tallCabinetHeight ?? prev.tallCabinetHeight,
      tallCabinetDepth: preset.tallCabinetDepth ?? prev.tallCabinetDepth,
      kickHeight: preset.kickHeight ?? prev.kickHeight,
      kickDepth: preset.kickDepth ?? prev.kickDepth,
      constructionMethod: preset.constructionMethod ?? prev.constructionMethod,
      shelfEdgeband: preset.shelfEdgeband ?? prev.shelfEdgeband,
      topDrawerHeight: preset.topDrawerHeight ?? prev.topDrawerHeight,
      drawerStyle: preset.drawerStyle ?? prev.drawerStyle,
    }));
  };

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);

    const selected = presets.find((p) => p.presetId === presetId);
    if (!selected) return;

    applyPresetToForm(selected);
  };

  const handleSubmit = async () => {
    try {
      const token = auth.user?.access_token;

      if (!token) {
        alert("You must be logged in to save a preset.");
        return;
      }

      if (!SAVE_PRESET_URL) {
        alert("Missing VITE_SAVE_PRESET_URL");
        return;
      }

      setIsSaving(true);

      const payload = {
        presetId: selectedPresetId || undefined,
        name: formData.presetName,
        presetType: "shop-standards",
        measurementUnit: formData.measurementUnit,
        projectName: formData.projectName,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        doorType: formData.doorType,
        sidesMaterial: formData.sidesMaterial,
        baseCabinetHeight: formData.baseCabinetHeight,
        baseCabinetDepth: formData.baseCabinetDepth,
        topCabinetHeight: formData.topCabinetHeight,
        topCabinetDepth: formData.topCabinetDepth,
        tallCabinetHeight: formData.tallCabinetHeight,
        tallCabinetDepth: formData.tallCabinetDepth,
        kickHeight: formData.kickHeight,
        kickDepth: formData.kickDepth,
        constructionMethod: formData.constructionMethod,
        shelfEdgeband: formData.shelfEdgeband,
        topDrawerHeight: formData.topDrawerHeight,
        drawerStyle: formData.drawerStyle,
      };

      const response = await fetch(SAVE_PRESET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("savePreset response:", data);

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
          >
            <option value="">
              {isLoadingPresets ? "Loading presets..." : "Select a preset"}
            </option>
            {presets.map((preset) => (
              <option key={preset.presetId} value={preset.presetId}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

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

        <div className="border rounded p-4">
          <TextInput
            label="Project Name"
            value={formData.projectName}
            onChange={(e) => handleChange("projectName", e.target.value)}
          />

          <TextInput
            label="Customer Name"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
          />

          <TextInput
            label="Customer Phone Number"
            value={formData.customerPhone}
            onChange={(e) => handleChange("customerPhone", e.target.value)}
          />

          <TextInput
            label="Customer Address"
            value={formData.customerAddress}
            onChange={(e) => handleChange("customerAddress", e.target.value)}
          />
        </div>

        <SelectInput
          label="Door / Fronts Type"
          options={["NOT Supplied", "Flat", "SFP"]}
          value={formData.doorType}
          onChange={(e) => handleChange("doorType", e.target.value)}
        />

        <SelectInput
          label="Cabinet Material"
          options={["Select Material", "3/4 Melamine", "3/4 Plywood"]}
          value={formData.sidesMaterial}
          onChange={(e) => handleChange("sidesMaterial", e.target.value)}
        />

        <div className="flex justify-start gap-10">
          <TextInput
            label="Base Cabinet Height"
            value={formData.baseCabinetHeight}
            onChange={(e) =>
              handleChange("baseCabinetHeight", Number(e.target.value))
            }
          />
          <TextInput
            label="Base Cabinet Depth"
            value={formData.baseCabinetDepth}
            onChange={(e) =>
              handleChange("baseCabinetDepth", Number(e.target.value))
            }
          />
        </div>

        <div className="flex justify-start gap-10">
          <TextInput
            label="Top Cabinet Height"
            value={formData.topCabinetHeight}
            onChange={(e) =>
              handleChange("topCabinetHeight", Number(e.target.value))
            }
          />
          <TextInput
            label="Top Cabinet Depth"
            value={formData.topCabinetDepth}
            onChange={(e) =>
              handleChange("topCabinetDepth", Number(e.target.value))
            }
          />
        </div>

        <div className="flex justify-start gap-10">
          <TextInput
            label="Tall Cabinet Height"
            value={formData.tallCabinetHeight}
            onChange={(e) =>
              handleChange("tallCabinetHeight", Number(e.target.value))
            }
          />
          <TextInput
            label="Tall Cabinet Depth"
            value={formData.tallCabinetDepth}
            onChange={(e) =>
              handleChange("tallCabinetDepth", Number(e.target.value))
            }
          />
        </div>

        <div className="flex justify-start gap-10">
          <TextInput
            label="Kick Height"
            value={formData.kickHeight}
            onChange={(e) => handleChange("kickHeight", Number(e.target.value))}
          />
          <TextInput
            label="Kick Depth"
            value={formData.kickDepth}
            onChange={(e) => handleChange("kickDepth", Number(e.target.value))}
          />
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