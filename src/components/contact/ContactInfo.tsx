import { Phone, Mail, MapPin, Clock } from "lucide-react";
import {businessInfo} from "../../types/businessInfo"

const CompanyName = businessInfo.name
const CompanyAddress = businessInfo.address
const CompanyPhoneNumber = businessInfo.phone
const CompanyEmail = businessInfo.email


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
            {CompanyPhoneNumber}
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#22c55e]" />
            {CompanyEmail}
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#22c55e]" />
            {CompanyAddress}
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