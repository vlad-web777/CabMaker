import { useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";

type CustomerSection =
  | "overview"
  | "orders"
  | "addresses"
  | "account"
  | "gift-cards"
  | "saved-carts";

type AdminSection =
  | "dashboard"
  | "customers"
  | "orders"
  | "tickets"
  | "files"
  | "analytics"
  | "settings";

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

const mockCustomers: CustomerRecord[] = [
  {
    userId: "usr_001",
    name: "John Smith",
    companyName: "Smith Cabinets",
    email: "john@smithcabinets.com",
    phone: "(617) 555-1200",
    address: "12 Main St, Boston, MA",
    role: "customer",
    ordersCount: 4,
    ticketsOpen: 1,
  },
  {
    userId: "usr_002",
    name: "Sarah Brown",
    companyName: "Brown Millwork",
    email: "sarah@brownmillwork.com",
    phone: "(508) 555-4421",
    address: "88 River Rd, Worcester, MA",
    role: "customer",
    ordersCount: 2,
    ticketsOpen: 0,
  },
  {
    userId: "usr_003",
    name: "Admin User",
    companyName: "Osmani Admin",
    email: "admin@example.com",
    phone: "(781) 555-9100",
    address: "1 Office Park, Boston, MA",
    role: "admin",
    ordersCount: 0,
    ticketsOpen: 0,
  },
];

export default function Account() {
  const auth = useAuth();

  const [customerSection, setCustomerSection] =
    useState<CustomerSection>("account");

  const [adminSection, setAdminSection] =
    useState<AdminSection>("dashboard");

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    mockCustomers[0]?.userId || ""
  );

  const signOutRedirect = async () => {
    await auth.removeUser();

    const clientId = "454b6vnvplepl6dma4dkf24245";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain =
      "https://us-east-1ir3zsdplk.auth.us-east-1.amazoncognito.com";

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <div className="mt-20 text-center">Please sign in</div>;
  }

  const profile = auth.user?.profile;

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

  const userEmail =
    typeof profile?.email === "string" ? profile.email : "No email";

  const userPhone =
    typeof profile?.phone_number === "string" ? profile.phone_number : "-";

  const selectedCustomer =
    mockCustomers.find((c) => c.userId === selectedCustomerId) ||
    mockCustomers[0];

  const placeholder = (name: string) => {
    window.alert(`${name} will be connected to backend next.`);
  };

  if (isAdmin) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Admin CRM
            </h1>
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
                ["tickets", "Tickets"],
                ["files", "Files"],
                ["analytics", "Analytics"],
                ["settings", "Settings"],
              ].map(([key, label]) => {
                const active = adminSection === key;
                return (
                  <li
                    key={key}
                    onClick={() => setAdminSection(key as AdminSection)}
                    className={`px-4 py-3 cursor-pointer transition ${
                      active
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
                    <div className="text-3xl font-semibold">128</div>
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

                  <div className="p-3 space-y-2">
                    {mockCustomers.map((customer) => {
                      const active = customer.userId === selectedCustomerId;
                      return (
                        <button
                          key={customer.userId}
                          onClick={() => setSelectedCustomerId(customer.userId)}
                          className={`w-full text-left border rounded p-3 transition ${
                            active
                              ? "border-green-500 bg-green-50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-gray-600">
                            {customer.companyName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {customer.email}
                          </div>
                        </button>
                      );
                    })}
                  </div>
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
                          <strong>Name:</strong> {selectedCustomer.name}
                        </p>
                        <p>
                          <strong>Company:</strong>{" "}
                          {selectedCustomer.companyName}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedCustomer.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedCustomer.phone}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p>
                          <strong>Address:</strong> {selectedCustomer.address}
                        </p>
                        <p>
                          <strong>Role:</strong> {selectedCustomer.role}
                        </p>
                        <p>
                          <strong>Orders:</strong> {selectedCustomer.ordersCount}
                        </p>
                        <p>
                          <strong>Open Tickets:</strong>{" "}
                          {selectedCustomer.ticketsOpen}
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
                          onClick={() => placeholder("Open customer orders")}
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
          ].map(([key, label]) => {
            const active = customerSection === key;
            return (
              <li
                key={key}
                onClick={() => setCustomerSection(key as CustomerSection)}
                className={`px-4 py-3 cursor-pointer transition ${
                  active
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
          <div className="grid md:grid-cols-3 gap-6">
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

        <div className="mt-10 inline-block text-sm text-red-600">
          <button className="cursor-pointer" onClick={signOutRedirect}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}