import React from "react";

const Toast: React.FC<{ message: string; type?: "success" | "error" }> = ({ message, type = "success" }) => {
  const styles = type === "success" ? "bg-accent-200 text-brand-900" : "bg-red-500 text-white";
  return (
    <div className={`rounded-full px-4 py-2 text-sm ${styles}`}>
      {message}
    </div>
  );
};

export default Toast;
