import React, { useState } from "react";
import Container from "../../components/common/Container";
import Breadcrumb from "../../components/common/Breadcrumb";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useToast } from "../../context/ToastContext";

function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Thank you! Your message has been sent to the Nellai Mart team.", "success");
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <Container>
      <div className="py-8 space-y-10">
        <Breadcrumb items={[{ label: "Contact Support" }]} />

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900">Contact & Support</h1>
          <p className="text-gray-600 mt-1">
            Have questions about listing your store or searching local products in Tirunelveli? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Support Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-soft space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Send us a message</h3>
            <Input
              label="Your Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. S. Murugesan"
            />
            <Input
              label="Phone Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98421 00000"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
            />
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Message / Query
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-hidden"
                placeholder="How can we help your store or shopping experience?"
              />
            </div>
            <Button type="submit" variant="primary" fullWidth size="lg">
              Send Message
            </Button>
          </form>

          {/* Contact Details & FAQs */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-soft space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Nellai Mart Help Desk</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <span>142, Town High Road, Tirunelveli, Tamil Nadu 627001</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <span>+91 98421 12345 / 0462-2334455</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <span>support@nellaimart.com</span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">🕒</span>
                  <span>Monday - Saturday: 9:00 AM - 8:00 PM</span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-100 space-y-3">
              <h4 className="text-base font-bold text-green-900">Merchant Registration Quick FAQ</h4>
              <p className="text-xs text-green-800 leading-relaxed">
                To list your store on Nellai Mart, click "Admin Portal", sign in or request a merchant account with your store GSTIN/trade license.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Contact;
