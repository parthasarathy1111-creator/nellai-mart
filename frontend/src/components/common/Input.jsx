import React from "react";

function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  label,
  error,
  className = "",
  id,
  name,
  required = false,
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 transition duration-200 outline-hidden focus:border-green-600 focus:ring-2 focus:ring-green-100 border-gray-300 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : ""
        } ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default Input;