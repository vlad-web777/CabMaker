import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import ProductsAdmin from "../pages/ProductsAdmin";
import { useNavigate } from "react-router-dom";

type CustomerSection =
  | "overview"
  | "orders"
  | "addresses"
  | "account"
  | "gift-cards"
  | "saved-carts"
  | "saved-presets";

type AdminSection =
  | "dashboard"
  | "customers"
  | "orders"
  | "products"
  | "tickets"
  | "files"
  | "analytics"
  | "settings"
  | "presets";

type CustomerRecord = {
  userId: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  role: "customer" | "admin";
  ordersCount: number;
  ticketsOpen: number;
};

type PresetQuestion = {
  key: string;
  label: string;
  value: string;
};

type PresetRecord = {
  presetId: string;
  userId: string;
  ownerName?: string;
  name: string;
  presetType: "shop-standards" | string;
  createdAt: string;
  updatedAt: string;

  // saved preset values from backend
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

  questions: PresetQuestion[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}



function toQuestion(
  key: string,
  label: string,
  value: string | number | undefined | null
): PresetQuestion {
  return {
    key,
    label,
    value: value === undefined || value === null ? "" : String(value),
  };
}

function buildQuestionsFromPreset(preset: any): PresetQuestion[] {
  if (Array.isArray(preset?.questions) && preset.questions.length > 0) {
    return preset.questions.map((q: any) => ({
      key: String(q.key ?? ""),
      label: String(q.label ?? q.key ?? ""),
      value: q.value === undefined || q.value === null ? "" : String(q.value),
    }));
  }

  return [
    toQuestion("measurementUnit", "Measurement Unit", preset.measurementUnit),
    toQuestion("projectName", "Project Name", preset.projectName),
    toQuestion("customerName", "Customer Name", preset.customerName),
    toQuestion("customerPhone", "Customer Phone", preset.customerPhone),
    toQuestion("customerAddress", "Customer Address", preset.customerAddress),
    toQuestion("doorType", "Door / Fronts Type", preset.doorType),
    toQuestion("sidesMaterial", "Cabinet Material", preset.sidesMaterial),
    toQuestion("baseCabinetHeight", "Base Cabinet Height", preset.baseCabinetHeight),
    toQuestion("baseCabinetDepth", "Base Cabinet Depth", preset.baseCabinetDepth),
    toQuestion("topCabinetHeight", "Top Cabinet Height", preset.topCabinetHeight),
    toQuestion("topCabinetDepth", "Top Cabinet Depth", preset.topCabinetDepth),
    toQuestion("tallCabinetHeight", "Tall Cabinet Height", preset.tallCabinetHeight),
    toQuestion("tallCabinetDepth", "Tall Cabinet Depth", preset.tallCabinetDepth),
    toQuestion("kickHeight", "Kick Height", preset.kickHeight),
    toQuestion("kickDepth", "Kick Depth", preset.kickDepth),
    toQuestion("constructionMethod", "Construction Method", preset.constructionMethod),
    toQuestion("shelfEdgeband", "Shelf Edgeband", preset.shelfEdgeband),
    toQuestion("topDrawerHeight", "Top Drawer Height", preset.topDrawerHeight),
    toQuestion("drawerStyle", "Drawer Style", preset.drawerStyle),
  ].filter((q) => q.value !== "");
}

function normalizePreset(raw: any): PresetRecord {
  return {
    presetId: String(raw.presetId ?? ""),
    userId: String(raw.userId ?? ""),
    ownerName: raw.ownerName ?? "",
    name: String(raw.name ?? ""),
    presetType: String(raw.presetType ?? "shop-standards"),
    createdAt: String(raw.createdAt ?? ""),
    updatedAt: String(raw.updatedAt ?? ""),

    measurementUnit: raw.measurementUnit,
    projectName: raw.projectName,
    customerName: raw.customerName,
    customerPhone: raw.customerPhone,
    customerAddress: raw.customerAddress,
    doorType: raw.doorType,
    sidesMaterial: raw.sidesMaterial,
    baseCabinetHeight: raw.baseCabinetHeight,
    baseCabinetDepth: raw.baseCabinetDepth,
    topCabinetHeight: raw.topCabinetHeight,
    topCabinetDepth: raw.topCabinetDepth,
    tallCabinetHeight: raw.tallCabinetHeight,
    tallCabinetDepth: raw.tallCabinetDepth,
    kickHeight: raw.kickHeight,
    kickDepth: raw.kickDepth,
    constructionMethod: raw.constructionMethod,
    shelfEdgeband: raw.shelfEdgeband,
    topDrawerHeight: raw.topDrawerHeight,
    drawerStyle: raw.drawerStyle,

    questions: buildQuestionsFromPreset(raw),
  };
}




export default function Account() {
  const auth = useAuth();

  debugger;
  const [customerSection, setCustomerSection] =
    useState<CustomerSection>("account");
  const [adminSection, setAdminSection] =
    useState<AdminSection>("dashboard");

  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState("all");

  const [presets, setPresets] = useState<PresetRecord[]>([]);
  const [presetsLoading, setPresetsLoading] = useState(false);
  const [presetsError, setPresetsError] = useState<string | null>(null);

  const [selectedPresetIds, setSelectedPresetIds] = useState<string[]>([]);
  const [editingPreset, setEditingPreset] = useState<PresetRecord | null>(null);
  // Vlad 4-18-2025: pull env for upodate API
  const [savingPreset, setSavingPreset] = useState(false);
  const profile = auth.user?.profile;

  const cognitoUsername =
    typeof profile?.["cognito:username"] === "string"
      ? profile["cognito:username"]
      : "";
      
  const groups = useMemo(() => {
    const rawGroups = profile?.["cognito:groups"];
    if (!rawGroups) return [];
    if (Array.isArray(rawGroups)) return rawGroups.map(String);
    return [String(rawGroups)];
  }, [profile]);

  const isAdmin = groups.includes("admin");
  const isCustomer = groups.includes("customer");

  const userName =
    (typeof profile?.name === "string" && profile.name) ||
    (typeof profile?.email === "string" && profile.email) ||
    "User";
  // console.log(userName)
  const userEmail =
    typeof profile?.email === "string" ? profile.email : "No email";

  const userPhone =
    typeof profile?.phone_number === "string" ? profile.phone_number : "-";

  const currentUserId =
    (typeof profile?.sub === "string" && profile.sub) || "";

  const selectedCustomer =
    customers.find((c) => c.userId === selectedCustomerId) || customers[0];

  const customerVisiblePresets = presets.filter(
    (preset) => preset.userId === currentUserId
  );

  const adminVisiblePresets =
    selectedCustomerId === "all"
      ? presets
      : presets.filter((preset) => preset.userId === selectedCustomerId);

  const GET_CUSTOMERS_URL = import.meta.env.VITE_GET_CUSTOMERS;
  const GET_PRESETS_URL = import.meta.env.VITE_GET_PRESETS;
  // Vlad 4-18-2025: pull env for upodate API
  const UPDATE_PRESET_URL = import.meta.env.VITE_UPDATE_PRESET_URL;

  useEffect(() => {
    if (!auth.isAuthenticated || !isAdmin || !GET_CUSTOMERS_URL) return;

    const loadCustomers = async () => {
      try {
        setCustomersLoading(true);
        setCustomersError(null);

        // const token = auth.user?.access_token || auth.user?.id_token;

        const response = await fetch(GET_CUSTOMERS_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (response.status === 403) {
          throw new Error("Forbidden");
        }

        if (!response.ok) {
          throw new Error("Failed to load customers");
        }

        const data = await response.json();
        // console.log("customers response:", data);
        setCustomers(Array.isArray(data.customers) ? data.customers : []);
      } catch (err) {
        setCustomersError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setCustomersLoading(false);
      }
    };

    loadCustomers();
  }, [auth.isAuthenticated, auth.user, isAdmin, GET_CUSTOMERS_URL]);

  useEffect(() => {
    if (!auth.isAuthenticated || !GET_PRESETS_URL) return;
    if (!isAdmin && !currentUserId) return;

    const loadPresets = async () => {
      try {
        setPresetsLoading(true);
        setPresetsError(null);

        const url = isAdmin
          ? `${GET_PRESETS_URL}?all=true`
          : `${GET_PRESETS_URL}?userId=${encodeURIComponent(currentUserId)}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.user?.access_token}`,
            "Content-Type": "application/json",
          },
        });

        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Failed to fetch presets: ${response.status} ${text}`);
        }

        const data = text ? JSON.parse(text) : {};
        setPresets(
          Array.isArray(data.presets)
            ? data.presets.map((preset: any) => normalizePreset(preset))
            : []
        );
      } catch (error) {
        console.error("loadPresets error:", error);
        setPresetsError(
          error instanceof Error ? error.message : "Failed to fetch presets"
        );
      } finally {
        setPresetsLoading(false);
      }
    };

    loadPresets();
  }, [GET_PRESETS_URL, auth.isAuthenticated, isAdmin, currentUserId]);

  const signOutRedirect = async () => {
    await auth.removeUser();
    const cognitoDomainAPI = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientIdAPI = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const clientId = clientIdAPI
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = cognitoDomainAPI;

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const navigate = useNavigate();

  const placeholder = (name: string) => {
    window.alert(`${name} will be connected to backend next.`);
  };

  // ,Waffle


  const togglePresetSelection = (presetId: string) => {
    setSelectedPresetIds((prev) =>
      prev.includes(presetId)
        ? prev.filter((id) => id !== presetId)
        : [...prev, presetId]
    );
  };

  const toggleSelectAll = (ids: string[]) => {
    const allSelected =
      ids.length > 0 && ids.every((id) => selectedPresetIds.includes(id));

    if (allSelected) {
      setSelectedPresetIds((prev) => prev.filter((id) => !ids.includes(id)));
      return;
    }

    setSelectedPresetIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const deleteSelectedPresets = () => {
    if (selectedPresetIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedPresetIds.length} selected preset(s)?`
    );

    if (!confirmed) return;

    setPresets((prev) =>
      prev.filter((preset) => !selectedPresetIds.includes(preset.presetId))
    );
    setSelectedPresetIds([]);
  };

  const updateEditingPresetName = (value: string) => {
    if (!editingPreset) return;
    setEditingPreset({ ...editingPreset, name: value });
  };

  const updateEditingQuestion = (key: string, value: string) => {
    if (!editingPreset) return;

    setEditingPreset({
      ...editingPreset,
      questions: editingPreset.questions.map((q) =>
        q.key === key ? { ...q, value } : q
      ),
    });
  };

  const savePresetEdits = async () => {
    if (!editingPreset) return;

    const updatedPreset = {
      ...editingPreset,
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(UPDATE_PRESET_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: updatedPreset.userId,
          presetId: updatedPreset.presetId,
          name: updatedPreset.name,
          presetType: updatedPreset.presetType,
          questions: updatedPreset.questions,
          updatedAt: updatedPreset.updatedAt,
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(`Failed to update preset: ${response.status} ${text}`);
      }

      //  update UI only after backend success
      setPresets((prev) =>
        prev.map((preset) =>
          preset.presetId === updatedPreset.presetId ? updatedPreset : preset
        )
      );

      setEditingPreset(null);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update preset");
    }
  };

  const renderPresetTable = (
    rows: PresetRecord[],
    showOwner: boolean,
    title: string,
    emptyText: string
  ) => {
    const visibleIds = rows.map((row) => row.presetId);
    const allVisibleSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedPresetIds.includes(id));

    return (
      <div className="border rounded bg-white overflow-hidden">
        <div className="border-b px-4 py-3 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-xs text-gray-500 mt-1">
              Click preset name to edit. Select multiple rows to delete.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => placeholder("Create preset")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              New Preset
            </button>

            <button
              onClick={deleteSelectedPresets}
              disabled={selectedPresetIds.length === 0}
              className={`px-4 py-2 rounded text-sm border ${selectedPresetIds.length === 0
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-red-600 border-red-300 hover:bg-red-50"
                }`}
            >
              Delete Selected
            </button>
          </div>
        </div>

        {presetsLoading ? (
          <div className="p-6 text-sm text-gray-600">Loading presets...</div>
        ) : presetsError ? (
          <div className="p-6 text-sm text-red-600">{presetsError}</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">{emptyText}</div>
        ) : (
          <div className="overflow-x-auto">



            {/* VLad 4-11-2026: Filter by customer PResets */}
            <table className="w-full text-sm">
              <thead className="bg-green-100 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 w-[50px]">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={() => toggleSelectAll(visibleIds)}
                    />
                  </th>
                  <th className="text-left px-4 py-3">Preset Name</th>
                  {showOwner && <th className="text-left px-4 py-3">Owner</th>}
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Created</th>
                  <th className="text-left px-4 py-3">Modified</th>
                  <th className="text-left px-4 py-3">Questions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((preset) => {
                  const checked = selectedPresetIds.includes(preset.presetId);

                  return (
                    <tr
                      key={preset.presetId}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePresetSelection(preset.presetId)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingPreset(normalizePreset(preset))}
                          className="text-green-600 hover:underline font-medium text-left"
                        >
                          {preset.name}
                        </button>
                      </td>
                      {showOwner && (
                        <td className="px-4 py-3">{preset.ownerName}</td>
                      )}
                      <td className="px-4 py-3">{preset.presetType}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDate(preset.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDate(preset.updatedAt)}
                      </td>
                      <td className="px-4 py-3">{preset.questions.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>


          </div>
        )}
      </div>
    );
  };

  if (auth.isLoading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <div className="mt-20 text-center">Please sign in</div>;
  }

  if (isAdmin) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Admin CRM</h1>
            <p className="text-sm text-gray-600 mt-1">
              Signed in as {userName} ({userEmail})
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => placeholder("Add user")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Add User
            </button>

            <button
              onClick={() => placeholder("Create order")}
              className="border border-green-500 text-green-600 px-4 py-2 rounded text-sm"
            >
              New Order
            </button>

            <button
              onClick={signOutRedirect}
              className="text-red-600 px-3 py-2 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[260px_1fr] gap-8">
          <div className="bg-gray-100 rounded overflow-hidden h-fit">
            <div className="p-4 border-l-4 border-green-500 text-green-600 font-semibold">
              CRM Navigation
            </div>

            <ul className="text-sm">
              {[
                ["dashboard", "Dashboard"],
                ["customers", "Customers"],
                ["orders", "Orders"],
                ["products", "Products"],
                ["tickets", "Tickets"],
                ["files", "Files"],
                ["analytics", "Analytics"],
                ["presets", "Presets"],
                ["settings", "Settings"],
              ].map(([key, label]) => {
                const active = adminSection === key;
                return (
                  <li
                    key={key}
                    onClick={() => setAdminSection(key as AdminSection)}
                    className={`px-4 py-3 cursor-pointer transition ${active
                      ? "text-green-600 font-medium bg-white border-l-4 border-green-500"
                      : "hover:bg-gray-200"
                      }`}
                  >
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            {adminSection === "dashboard" && (
              <>
                <div className="border border-green-300 bg-green-50 rounded p-4 mb-8 text-sm">
                  Admin dashboard shell is ready. Next step is wiring cards to
                  DynamoDB and API data.
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="border rounded p-5 bg-white">
                    <div className="text-sm text-gray-500 mb-2">
                      Total Customers
                    </div>
                    <div className="text-3xl font-semibold">
                      {customers.length || 0}
                    </div>
                  </div>

                  <div className="border rounded p-5 bg-white">
                    <div className="text-sm text-gray-500 mb-2">
                      Open Tickets
                    </div>
                    <div className="text-3xl font-semibold">7</div>
                  </div>

                  <div className="border rounded p-5 bg-white">
                    <div className="text-sm text-gray-500 mb-2">
                      Orders This Month
                    </div>
                    <div className="text-3xl font-semibold">31</div>
                  </div>

                  <div className="border rounded p-5 bg-white">
                    <div className="text-sm text-gray-500 mb-2">
                      Pending XML Jobs
                    </div>
                    <div className="text-3xl font-semibold">5</div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="border rounded bg-white">
                    <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                      Quick Actions
                    </div>
                    <div className="p-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => placeholder("Add customer")}
                        className="bg-green-500 text-white px-4 py-2 rounded text-sm"
                      >
                        Add Customer
                      </button>
                      <button
                        onClick={() => placeholder("Assign ticket")}
                        className="border px-4 py-2 rounded text-sm"
                      >
                        Assign Ticket
                      </button>
                      <button
                        onClick={() => placeholder("Export customers")}
                        className="border px-4 py-2 rounded text-sm"
                      >
                        Export Customers
                      </button>
                    </div>
                  </div>

                  <div className="border rounded bg-white">
                    <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                      Admin Account
                    </div>
                    <div className="p-4 text-sm space-y-2">
                      <p>
                        <strong>Name:</strong> {userName}
                      </p>
                      <p>
                        <strong>Email:</strong> {userEmail}
                      </p>
                      <p>
                        <strong>Phone:</strong> {userPhone}
                      </p>
                      <p>
                        <strong>Groups:</strong>{" "}
                        {groups.length > 0 ? groups.join(", ") : "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {adminSection === "customers" && (
              <div className="grid lg:grid-cols-[340px_1fr] gap-6">
                <div className="border rounded bg-white overflow-hidden">
                  <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50 flex items-center justify-between">
                    <span>Customers</span>
                    <button
                      onClick={() => placeholder("Add user")}
                      className="text-green-600 text-xs"
                    >
                      + Add
                    </button>
                  </div>

                  {customersLoading && (
                    <div className="p-4 text-sm text-gray-600">
                      Loading customers...
                    </div>
                  )}

                  {customersError && (
                    <div className="p-4 text-sm text-red-600">
                      {customersError}
                    </div>
                  )}

                  {!customersLoading && !customersError && (
                    <div className="p-3 space-y-2">
                      {customers.length === 0 ? (
                        <div className="text-sm text-gray-500 p-2">
                          No customers found.
                        </div>
                      ) : (
                        customers.map((customer) => {
                          const active = customer.userId === selectedCustomerId;
                          return (
                            <button
                              key={customer.userId}
                              onClick={() => setSelectedCustomerId(customer.userId)}
                              className={`w-full text-left border rounded p-3 transition ${active
                                ? "border-green-500 bg-green-50"
                                : "hover:bg-gray-50"
                                }`}
                            >
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-gray-600">
                                {customer.companyName || "-"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {customer.email}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="border rounded bg-white">
                    <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50 flex items-center justify-between">
                      <span>Customer Profile</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => placeholder("Edit customer")}
                          className="bg-green-500 text-white px-3 py-1.5 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => placeholder("Create ticket")}
                          className="border border-green-500 text-green-600 px-3 py-1.5 rounded text-sm"
                        >
                          New Ticket
                        </button>
                      </div>
                    </div>

                    <div className="p-4 grid md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-2">
                        <p>
                          <strong>Name:</strong> {selectedCustomer?.name || "-"}
                        </p>
                        <p>
                          <strong>Company:</strong>{" "}
                          {selectedCustomer?.companyName || "-"}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedCustomer?.email || "-"}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedCustomer?.phone || "-"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>Address:</strong>{" "}
                          {selectedCustomer?.address || "-"}
                        </p>
                        <p>
                          <strong>Role:</strong> {selectedCustomer?.role || "-"}
                        </p>
                        <p>
                          <strong>Orders:</strong>{" "}
                          {selectedCustomer?.ordersCount ?? 0}
                        </p>
                        <p>
                          <strong>Open Tickets:</strong>{" "}
                          {selectedCustomer?.ticketsOpen ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border rounded bg-white">
                      <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                        Orders
                      </div>
                      <div className="p-4 text-sm">
                        <p className="mb-3">
                          View all orders tied to this customer.
                        </p>
                        <button
                          // Vlad 4-18-2026: View Order Button Soup
                          // onClick={() => placeholder("Open customer orders")}
                          onClick={() => navigate("/user-orders")}
                          className="bg-green-500 text-white px-3 py-2 rounded text-sm"
                        >
                          View Orders
                        </button>
                      </div>
                    </div>

                    <div className="border rounded bg-white">
                      <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                        Tickets
                      </div>
                      <div className="p-4 text-sm">
                        <p className="mb-3">
                          Open support/correspondence history.
                        </p>
                        <button
                          onClick={() => placeholder("Open customer tickets")}
                          className="bg-green-500 text-white px-3 py-2 rounded text-sm"
                        >
                          View Tickets
                        </button>
                      </div>
                    </div>

                    <div className="border rounded bg-white">
                      <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                        Files
                      </div>
                      <div className="p-4 text-sm">
                        <p className="mb-3">
                          See uploads, drawings, and XML exports.
                        </p>
                        <button
                          onClick={() => placeholder("Open customer files")}
                          className="bg-green-500 text-white px-3 py-2 rounded text-sm"
                        >
                          View Files
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded bg-white">
                    <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                      Internal Notes
                    </div>
                    <div className="p-4">
                      <textarea
                        className="w-full min-h-[140px] border rounded p-3 text-sm"
                        placeholder="Add internal CRM notes for this customer..."
                      />
                      <div className="mt-3">
                        <button
                          onClick={() => placeholder("Save notes")}
                          className="bg-green-500 text-white px-4 py-2 rounded text-sm"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {adminSection === "orders" && (
              <div className="border rounded bg-white">
                <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50 flex items-center justify-between">
                  <span>Orders</span>
                  <button
                    onClick={() => placeholder("Create order")}
                    className="bg-green-500 text-white px-3 py-1.5 rounded text-sm"
                  >
                    New Order
                  </button>
                </div>
                <div className="p-4 text-sm text-gray-600">
                  This section should show quote requests, XML generation
                  status, production status, and order history.
                </div>
              </div>
            )}

            {adminSection === "products" && <ProductsAdmin />}

            {adminSection === "tickets" && (
              <div className="border rounded bg-white">
                <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                  Tickets
                </div>
                <div className="p-4 text-sm text-gray-600">
                  This section should become your ticketing/correspondence
                  system, with messages, attachments, statuses, and assignment.
                </div>
              </div>
            )}

            {adminSection === "files" && (
              <div className="border rounded bg-white">
                <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                  Files
                </div>
                <div className="p-4 text-sm text-gray-600">
                  This section should list S3-backed uploads, drawings, PDFs,
                  and generated XML files.
                </div>
              </div>
            )}

            {adminSection === "analytics" && (
              <div className="border rounded bg-white">
                <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                  Analytics
                </div>
                <div className="p-4 text-sm text-gray-600">
                  This section should later show monthly orders, conversion,
                  top customers, and file upload activity.
                </div>
              </div>
            )}

            {adminSection === "presets" && (
              <div className="space-y-6">
                <div className="border rounded bg-white p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-sm font-semibold text-gray-800">
                      Filter by customer:
                    </div>

                    {/* <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="border rounded px-3 py-2 text-sm"
                    >
                      <option value="all">All Customers</option>
                      {customers.map((customer) => (
                        <option key={customer.userId} value={customer.userId}>
                          {customer.name}
                        </option>
                      ))}
                    </select> */}
                    {/* VLad 4-11-2026: Filter by customer PResets */}
                    <input className="border rounded px-3 py-2 text-sm" name="myInput" />

                  </div>
                </div>

                {renderPresetTable(
                  adminVisiblePresets,
                  true,
                  "Customer Presets",
                  "No presets found for this customer."
                )}
              </div>
            )}

            {adminSection === "settings" && (
              <div className="border rounded bg-white">
                <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                  Settings
                </div>
                <div className="p-4 text-sm text-gray-600">
                  This section can hold CRM settings, default statuses, tags,
                  notification rules, and admin preferences.
                </div>
              </div>
            )}
          </div>
        </div>

        {editingPreset && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
              <div className="border-b px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Edit Preset</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Update preset name and saved answers.
                  </p>
                </div>
                <button
                  onClick={() => setEditingPreset(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Close
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preset Name
                  </label>
                  <input
                    value={editingPreset.name}
                    onChange={(e) => updateEditingPresetName(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Owner:</strong> {editingPreset.ownerName}
                  </div>
                  <div>
                    <strong>Type:</strong> {editingPreset.presetType}
                  </div>
                  <div>
                    <strong>Created:</strong> {formatDate(editingPreset.createdAt)}
                  </div>
                  <div>
                    <strong>Modified:</strong>{" "}
                    {formatDate(editingPreset.updatedAt)}
                  </div>
                </div>

                <div className="border rounded">
                  <div className="border-b px-4 py-3 bg-gray-50 font-semibold text-sm">
                    Preset Questions
                  </div>



                  <div className="border rounded">
                    <div className="border-b px-4 py-3 bg-gray-50 font-semibold text-sm">
                      Preset Questions
                    </div>

                    <div className="p-4 space-y-4">
                      {editingPreset.questions.length === 0 ? (
                        <div className="text-sm text-gray-500">
                          No saved preset values found for this preset.
                        </div>
                      ) : (
                        editingPreset.questions.map((question) => (
                          <div key={question.key}>
                            <label className="block text-sm font-medium mb-2">
                              {question.label}
                            </label>
                            <input
                              value={question.value}
                              onChange={(e) =>
                                updateEditingQuestion(question.key, e.target.value)
                              }
                              className="w-full border rounded px-3 py-2 text-sm"
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>





                </div>
              </div>

              <div className="border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setEditingPreset(null)}
                  className="border px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={savePresetEdits}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-12 flex gap-10">
      <div className="w-[260px] bg-gray-100 rounded shrink-0">
        <div className="p-4 border-l-4 border-green-500 text-green-600 font-semibold">
          {isCustomer ? "My Account" : "Account"}
        </div>

        <ul className="text-sm">
          {[
            ["overview", "Overview"],
            ["orders", "My Orders"],
            ["addresses", "Address Book"],
            ["account", "Account Information"],
            ["gift-cards", "Gift Cards"],
            ["saved-carts", "Saved Carts"],
            ["saved-presets", "Saved Presets"],
          ].map(([key, label]) => {
            const active = customerSection === key;
            return (
              <li
                key={key}
                onClick={() => setCustomerSection(key as CustomerSection)}
                className={`px-4 py-3 cursor-pointer transition ${active
                  ? "text-green-600 font-medium bg-white border-l-4 border-green-500"
                  : "hover:bg-gray-200"
                  }`}
              >
                {label}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex-1">
        <div className="border border-green-300 bg-green-50 rounded p-4 mb-8 text-sm">
          Current Cabinet lead time (with and without drawers) is 5 to 7
          Business Days.
        </div>

        {customerSection === "overview" && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="border rounded p-5">
              <div className="text-sm text-gray-500 mb-2">Account Type</div>
              <div className="font-semibold">
                {isCustomer ? "Customer" : "Standard User"}
              </div>
            </div>
            <div className="border rounded p-5">
              <div className="text-sm text-gray-500 mb-2">Saved Carts</div>
              <div className="font-semibold">0</div>
            </div>
            <div className="border rounded p-5">
              <div className="text-sm text-gray-500 mb-2">Orders</div>
              <div className="font-semibold">0</div>
            </div>
            <div className="border rounded p-5">
              <div className="text-sm text-gray-500 mb-2">Saved Presets</div>
              <div className="font-semibold">
                {customerVisiblePresets.length}
              </div>
            </div>
          </div>
        )}

        {customerSection === "orders" && (
          <div className="border rounded p-6 text-sm text-gray-600">
            No orders yet.
          </div>
        )}

        {customerSection === "addresses" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded">
              <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                DEFAULT BILLING ADDRESS
              </div>
              <div className="p-4 text-sm space-y-1">
                <p>{userName}</p>
                <p>123 Example Street</p>
                <p>Boston, Massachusetts</p>
                <p>United States</p>
                <p>T: {userPhone}</p>
              </div>
            </div>

            <div className="border rounded">
              <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                DEFAULT SHIPPING ADDRESS
              </div>
              <div className="p-4 text-sm space-y-1">
                <p>{userName}</p>
                <p>123 Example Street</p>
                <p>Boston, Massachusetts</p>
                <p>United States</p>
                <p>T: {userPhone}</p>
              </div>
            </div>
          </div>
        )}

        {customerSection === "account" && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="border rounded">
              <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                CONTACT INFORMATION
              </div>
              <div className="p-4 text-sm space-y-1">
                <p>
                  <strong>Business Name:</strong> {cognitoUsername}
                </p>
                <p>
                  <strong>Name:</strong> {userName}
                </p>
                <p>
                  <strong>Email:</strong> {userEmail}
                </p>
                <p>
                  <strong>Phone:</strong> {userPhone}
                </p>
                <p>
                  <strong>Groups:</strong>{" "}
                  {groups.length > 0 ? groups.join(", ") : "None"}
                </p>
              </div>
            </div>

            <div className="border rounded">
              <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                NEWSLETTERS
              </div>
              <div className="p-4 text-sm">
                You aren't subscribed to our newsletter.
              </div>
            </div>
          </div>
        )}

        {customerSection === "gift-cards" && (
          <div className="border rounded p-6 text-sm text-gray-600">
            Gift card functionality can be added later.
          </div>
        )}

        {customerSection === "saved-carts" && (
          <div className="border rounded p-6 text-sm text-gray-600">
            No saved carts yet.
          </div>
        )}

        {customerSection === "saved-presets" && (
          <div className="space-y-6">
            <div className="border rounded bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Saved Presets</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your saved shop standard presets. You can open, edit,
                    and remove one or more presets from here.
                  </p>
                </div>

                <button
                  onClick={() => placeholder("Create preset")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                >
                  New Preset
                </button>
              </div>
            </div>

            {renderPresetTable(
              customerVisiblePresets,
              false,
              "My Presets",
              "No saved presets yet."
            )}
          </div>
        )}

        <div className="mt-10 inline-block text-sm text-red-600">
          <button className="cursor-pointer" onClick={signOutRedirect}>
            Sign out
          </button>
        </div>
      </div>

      {editingPreset && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Edit Preset</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update preset name and saved answers.
                </p>
              </div>
              <button
                onClick={() => setEditingPreset(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preset Name
                </label>
                <input
                  value={editingPreset.name}
                  onChange={(e) => updateEditingPresetName(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Owner:</strong> {editingPreset.ownerName}
                </div>
                <div>
                  <strong>Type:</strong> {editingPreset.presetType}
                </div>
                <div>
                  <strong>Created:</strong> {formatDate(editingPreset.createdAt)}
                </div>
                <div>
                  <strong>Modified:</strong> {formatDate(editingPreset.updatedAt)}
                </div>
              </div>

              <div className="border rounded">
                <div className="border-b px-4 py-3 bg-gray-50 font-semibold text-sm">
                  Preset Questions
                </div>

                <div className="p-4 space-y-4">
                  {editingPreset.questions.map((question) => (
                    <div key={question.key}>
                      <label className="block text-sm font-medium mb-2">
                        {question.label}
                      </label>
                      <input
                        value={question.value}
                        onChange={(e) =>
                          updateEditingQuestion(question.key, e.target.value)
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setEditingPreset(null)}
                className="border px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={savePresetEdits}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
