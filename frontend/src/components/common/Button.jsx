import React from "react";

function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
  disabled = false,
  fullWidth = false,
}) {
  const baseStyle =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-xs",
    secondary:
      "bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200 border border-green-200 focus:ring-green-500",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-green-500 shadow-xs",
    ghost:
      "text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400",
    accent:
      "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-400 shadow-xs",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-xs",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;