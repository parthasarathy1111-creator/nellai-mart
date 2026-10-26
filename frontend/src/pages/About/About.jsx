import React from "react";
import Container from "../../components/common/Container";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";

function About() {
  return (
    <Container>
      <div className="py-8 space-y-12">
        <Breadcrumb items={[{ label: "About Us" }]} />

        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
            Hyperlocal Discovery Engine
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Empowering Tirunelveli's <span className="text-green-600">Local Merchants</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Nellai Mart bridges neighborhood consumers with offline retail merchants, giving local stores high digital visibility, real-time inventory discovery, and direct customer connectivity.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 text-2xl flex items-center justify-center font-bold">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-gray-900">Instant Local Search</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Find Boiled Rice, Boiled Milk, Spices, and Daily Provisions instantly in shops near Town, Palayamkottai, Vannarpettai, and Junction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 text-2xl flex items-center justify-center font-bold">
              🤝
            </div>
            <h3 className="text-xl font-bold text-gray-900">Hyperlocal Trust</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We empower verified traditional merchants who have served Tirunelveli families for decades with modern inventory cataloging tools.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 text-2xl flex items-center justify-center font-bold">
              📍
            </div>
            <h3 className="text-xl font-bold text-gray-900">Direct Store Contact</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              No middleman commission fees. Get direct phone contact and Google Maps directions to visit the store in person.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Are you a merchant in Tirunelveli?</h3>
            <p className="text-gray-400 text-sm mt-1">Join over 400+ local store owners digitizing their daily catalog on Nellai Mart.</p>
          </div>
          <Link to="/admin/login">
            <Button variant="primary" size="lg">
              Sign In to Merchant Portal
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default About;
