import React from "react";
import {businessInfo} from "../types/businessInfo"

const CompanyName = businessInfo.name
const CompanyAddress = businessInfo.address
const CompanyPhoneNumber = businessInfo.phone
const CompanyEmail = businessInfo.email/*

  Full About Us Page
  -----------------
  Contains:
  - HeroSection
  - ContentSection (story + mission)
  - TeamSection
  - CTASection
  All modular and editable.
*/
const titleAbout = `About ${CompanyName}`
export default function About() {
  return (
    <div className="bg-gray-50 pt-[80px]">

      {/* Hero Section */}
      <HeroSection
        title={titleAbout}
        subtitle="Quality cabinetry crafted with precision and care"
        imageUrl="/images/about-hero.jpg"
      />

      {/* Story Section */}
      <ContentSection
        title="Our Story"
        content="We started our company with a vision to bring high-quality, customizable cabinetry to every home. Our team focuses on precision, design, and customer satisfaction. Replace this text with your real story."
        imageUrl="/images/about-story.jpg"
        imageLeft={true}
      />

      {/* Mission Section */}
      <ContentSection
        title="Our Mission"
        content="Our mission is to provide beautiful, durable, and functional cabinets while making the process seamless for our clients. Replace this content with your mission statement."
        imageUrl="/images/about-mission.jpg"
        imageLeft={false}
      />

      {/* Team Section */}
      {/* <TeamSection
        title="Meet the Team"
        members={[
          { name: "John Doe", role: "Founder & CEO", image: "/images/team1.jpg" },
          { name: "Jane Smith", role: "Lead Designer", image: "/images/team2.jpg" },
          { name: "Michael Lee", role: "Head Carpenter", image: "/images/team3.jpg" },
        ]}
      /> */}

      {/* Call to Action Section */}
      <CTASection
        title="Ready to Start Your Project?"
        buttonText="Get a Quote"
        buttonLink="/builder"
      />

    </div>
  );
}

/* -----------------------------
   Hero Section
----------------------------- */
function HeroSection({
  title,
  subtitle,
  imageUrl,
}: {
  title: string;
  subtitle: string;
  imageUrl: string;
}) {
  return (
    <div
      className="relative h-[400px] flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="bg-black/50 p-8 rounded-md text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-4 text-lg">{subtitle}</p>
      </div>
    </div>
  );
}

/* -----------------------------
   Content Section (Text + Image)
----------------------------- */
function ContentSection({
  title,
  content,
  imageUrl,
  imageLeft = true,
}: {
  title: string;
  content: string;
  imageUrl: string;
  imageLeft?: boolean;
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16">
      <div
        className={`flex flex-col lg:flex-row gap-8 items-center ${
          imageLeft ? "" : "lg:flex-row-reverse"
        }`}
      >
        <div className="lg:w-1/2">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-xl shadow-lg object-cover w-full h-[300px]"
          />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-semibold text-[#1a1a2e] mb-4">{title}</h2>
          <p className="text-gray-700">{content}</p>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------
   Team Section
----------------------------- */
function TeamSection({
  title,
  members,
}: {
  title: string;
  members: { name: string; role: string; image: string }[];
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-16">
      <h2 className="text-3xl font-semibold text-[#1a1a2e] mb-12 text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member) => (
          <div
            key={member.name}
            className="bg-white p-6 rounded-xl shadow-md text-center"
          >
            <img
              src={member.image}
              alt={member.name}
              className="mx-auto w-32 h-32 object-cover rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -----------------------------
   Call to Action Section
----------------------------- */
function CTASection({
  title,
  buttonText,
  buttonLink,
}: {
  title: string;
  buttonText: string;
  buttonLink: string;
}) {
  return (
    <section className="bg-[#22c55e] py-16 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <a
          href={buttonLink}
          className="bg-white text-[#22c55e] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}