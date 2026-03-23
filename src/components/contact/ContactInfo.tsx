import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg text-[#1a1a2e] mb-4">
          Contact Information
        </h3>

        <div className="space-y-3 text-gray-600">

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-[#22c55e]" />
            (239) 784-0494
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#22c55e]" />
            deniselite77@yahoo.com
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#22c55e]" />
            Nashville, Tn
          </div>

        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg text-[#1a1a2e] mb-4">
          Business Hours
        </h3>

        <div className="flex items-start gap-3 text-gray-600">
          <Clock className="w-5 h-5 text-[#22c55e]" />

          <div>
            <p>Mon – Fri: 9am – 6pm</p>
            <p>Saturday: 10am – 4pm</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>

    </div>
  );
}