export default function APIErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">API Error</h1>
      <p className="text-lg text-gray-700 mb-6">Sorry, there was an error fetching data from the API. Please try again later.</p>
      <a href="/" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Go Back Home</a>
    </div>
  );
}