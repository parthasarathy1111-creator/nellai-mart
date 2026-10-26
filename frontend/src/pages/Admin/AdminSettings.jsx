import React, { useState, useEffect } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import { adminService } from "../../services/adminService";

function AdminSettings() {
  const { showToast } = useToast();
  const [platformName, setPlatformName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      setLoading(true);
      setServerError("");
      try {
        const data = await adminService.getSettings();
        if (isMounted && data) {
          setPlatformName(data.platformName || "Nellai Mart");
          setContactEmail(data.contactEmail || "support@nellaimart.com");
          setContactPhone(data.contactPhone || "+91 98421 12345");
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load settings:", err);
          setServerError("Unable to load current settings. Using default fallback values.");
          showToast("Failed to load settings from server", "error");
          // Fallback defaults
          setPlatformName("Nellai Mart");
          setContactEmail("support@nellaimart.com");
          setContactPhone("+91 98421 12345");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const validate = () => {
    const errs = {};

    if (!platformName || !platformName.trim()) {
      errs.platformName = "Platform Name is required and cannot be empty.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || !contactEmail.trim()) {
      errs.contactEmail = "Official Contact Email is required.";
    } else if (!emailRegex.test(contactEmail.trim())) {
      errs.contactEmail = "Please enter a valid email address (e.g. support@nellaimart.com).";
    }

    // Accepts 10 digits with optional +91 prefix and optional hyphens/spaces
    const cleanedPhone = (contactPhone || "").replace(/[\s\-()]/g, "");
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!contactPhone || !contactPhone.trim()) {
      errs.contactPhone = "Support Phone Number is required.";
    } else if (!phoneRegex.test(cleanedPhone)) {
      errs.contactPhone = "Please enter a valid 10-digit Indian phone number (e.g. +91 98421 12345).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) {
      showToast("Please correct the errors in the form before saving.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        platformName: platformName.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone.trim(),
      };

      const saved = await adminService.updateSettings(payload);

      if (saved) {
        setPlatformName(saved.platformName || payload.platformName);
        setContactEmail(saved.contactEmail || payload.contactEmail);
        setContactPhone(saved.contactPhone || payload.contactPhone);
      }

      setErrors({});
      showToast("System settings saved successfully", "success");
    } catch (err) {
      console.error("Save settings error:", err);
      const msg = err.message || "Failed to save system settings. Please try again.";
      setServerError(msg);
      showToast(msg, "error");
      // Entered values in state are preserved!
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner label="Loading system settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500">Configure platform metadata and notification preferences</p>
      </div>

      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
          <span>⚠️</span>
          <div>
            <p className="font-semibold">Unable to save settings</p>
            <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg border border-gray-200 shadow-soft space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">General Platform Config</h3>

        <Input
          label="Platform Name"
          value={platformName}
          onChange={(e) => {
            setPlatformName(e.target.value);
            if (errors.platformName) setErrors((prev) => ({ ...prev, platformName: "" }));
          }}
          error={errors.platformName}
          placeholder="e.g. Nellai Mart"
          required
        />

        <Input
          label="Official Contact Email"
          type="email"
          value={contactEmail}
          onChange={(e) => {
            setContactEmail(e.target.value);
            if (errors.contactEmail) setErrors((prev) => ({ ...prev, contactEmail: "" }));
          }}
          error={errors.contactEmail}
          placeholder="e.g. support@nellaimart.com"
          required
        />

        <Input
          label="Support Phone Number"
          type="tel"
          value={contactPhone}
          onChange={(e) => {
            setContactPhone(e.target.value);
            if (errors.contactPhone) setErrors((prev) => ({ ...prev, contactPhone: "" }));
          }}
          error={errors.contactPhone}
          placeholder="e.g. +91 98421 12345"
          required
        />

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Settings are persisted to the database and update immediately.</p>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AdminSettings;
