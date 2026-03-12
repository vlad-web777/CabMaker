import { useAuth } from "react-oidc-context"

export default function Account() {

    const auth = useAuth()
    const signOutRedirect = async () => {
        await auth.removeUser(); // clears user from react-oidc-context

        const clientId = "454b6vnvplepl6dma4dkf24245";
        const logoutUri = "http://localhost:5173/";
        const cognitoDomain = "https://us-east-1ir3zsdplk.auth.us-east-1.amazoncognito.com";

        window.location.href =
            `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };


    if (auth.isLoading) {
        return <div className="mt-20 text-center">Loading...</div>
    }

    if (!auth.isAuthenticated) {
        return <div className="mt-20 text-center">Please sign in</div>
    }

    const user = auth.user?.profile

    return (
        <div className="max-w-[1300px] mx-auto px-6 py-12 flex gap-10">

            {/* LEFT MENU */}

            <div className="w-[260px] bg-gray-100 rounded">

                <div className="p-4 border-l-4 border-green-500 text-green-600 font-semibold">
                    My Account
                </div>

                <ul className="text-sm">

                    <li className="px-4 py-3 hover:bg-gray-200 cursor-pointer">
                        My Orders
                    </li>

                    <li className="px-4 py-3 hover:bg-gray-200 cursor-pointer">
                        Address Book
                    </li>

                    <li className="px-4 py-3 text-green-600 font-medium bg-white border-l-4 border-green-500">
                        Account Information
                    </li>

                    <li className="px-4 py-3 hover:bg-gray-200 cursor-pointer">
                        Gift Cards
                    </li>

                    <li className="px-4 py-3 hover:bg-gray-200 cursor-pointer">
                        Saved Carts
                    </li>

                </ul>

            </div>


            {/* RIGHT CONTENT */}

            <div className="flex-1">

                {/* NOTICE */}

                <div className="border border-green-300 bg-green-50 rounded p-4 mb-8 text-sm">
                    Current Cabinet lead time (with and without drawers)
                    is 5 to 7 Business Days.
                </div>


                {/* ACCOUNT INFORMATION */}

                <h2 className="text-lg font-semibold mb-4">
                    Account Information
                </h2>


                <div className="grid md:grid-cols-2 gap-6 mb-10">

                    {/* CONTACT INFO */}

                    <div className="border rounded">

                        <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                            CONTACT INFORMATION
                        </div>

                        <div className="p-4 text-sm space-y-1">

                            <p>
                                <strong>Name:</strong> {user?.name || "User"}
                            </p>

                            <p>
                                <strong>Email:</strong> {user?.email}
                            </p>

                            <p>
                                <strong>Phone:</strong> {user?.phone_number || "-"}
                            </p>

                            <p>
                                <strong>KCD Code:</strong> -
                            </p>

                            <p>
                                <strong>Account Number:</strong> -
                            </p>

                            <div className="flex gap-3 mt-4">

                                <button className="bg-green-500 text-white px-4 py-1.5 rounded text-sm">
                                    Edit
                                </button>

                                <button className="border border-green-500 text-green-600 px-4 py-1.5 rounded text-sm">
                                    Change Password
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* NEWSLETTER */}

                    <div className="border rounded">

                        <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                            NEWSLETTERS
                        </div>

                        <div className="p-4 text-sm">

                            <p className="mb-6">
                                You aren't subscribed to our newsletter.
                            </p>

                            <button className="bg-green-500 text-white px-4 py-1.5 rounded text-sm">
                                Edit
                            </button>

                        </div>

                    </div>

                </div>


                {/* ADDRESS BOOK */}

                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-lg font-semibold">
                        Address Book
                    </h2>

                    <button className="bg-green-500 text-white px-4 py-1.5 rounded text-sm">
                        Manage Addresses
                    </button>

                </div>


                <div className="grid md:grid-cols-2 gap-6">

                    {/* BILLING */}

                    <div className="border rounded">

                        <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                            DEFAULT BILLING ADDRESS
                        </div>

                        <div className="p-4 text-sm space-y-1">

                            <p>{user?.name}</p>
                            <p>123 Example Street</p>
                            <p>Boston, Massachusetts</p>
                            <p>United States</p>
                            <p>T: {user?.phone_number || "-"}</p>

                            <button className="mt-4 bg-green-500 text-white px-4 py-1.5 rounded text-sm">
                                Edit Address
                            </button>

                        </div>

                    </div>


                    {/* SHIPPING */}

                    <div className="border rounded">

                        <div className="border-b px-4 py-3 font-semibold text-sm bg-gray-50">
                            DEFAULT SHIPPING ADDRESS
                        </div>

                        <div className="p-4 text-sm space-y-1">

                            <p>{user?.name}</p>
                            <p>123 Example Street</p>
                            <p>Boston, Massachusetts</p>
                            <p>United States</p>
                            <p>T: {user?.phone_number || "-"}</p>

                            <button className="mt-4 bg-green-500 text-white px-4 py-1.5 rounded text-sm">
                                Edit Address
                            </button>

                        </div>

                    </div>

                </div>


                {/* LOGOUT */}

                <div className="mt-10  inline-block text-sm text-red-600" >

                    <button className="cursor-pointer" onClick={() => signOutRedirect()}>Sign out</button>

                </div>

            </div>

        </div>
    )
}