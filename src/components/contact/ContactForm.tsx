import { useState } from "react";



export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(form);
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">

      <h2 className="text-2xl font-semibold text-[#1a1a2e] mb-6">
        Send a Message
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full mt-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold py-2 rounded-md transition"
        >
          Send Message
        </button>

      </form>
    </div>
  );
}