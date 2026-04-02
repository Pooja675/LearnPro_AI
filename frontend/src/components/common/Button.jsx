import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const baseStyles = `
  inline-flex items-center justify-center gap-2
  font-semibold rounded-xl
  transition-all duration-200
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-1
`;
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-200/50",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline:
      "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md shadow-red-200/50",
  };

  const sizeStyles = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

export default Button;
