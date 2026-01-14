"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:!bg-white group-[.toaster]:!text-[#231F20] group-[.toaster]:!border-gray-200 group-[.toaster]:dark:!bg-[#0A1A3A] group-[.toaster]:dark:!text-white group-[.toaster]:dark:!border-[#1A2F5A] group-[.toaster]:shadow-lg transition-colors duration-300",
          description: "group-[.toast]:!text-gray-600 group-[.toast]:dark:!text-blue-200/70 transition-colors duration-300",
          actionButton: "group-[.toast]:!bg-[#E35000] group-[.toast]:!text-white group-[.toast]:hover:!bg-[#c44500] transition-colors duration-300",
          cancelButton: "group-[.toast]:!bg-gray-100 group-[.toast]:!text-[#231F20] group-[.toast]:hover:!bg-gray-200 group-[.toast]:dark:!bg-[#1A2F5A] group-[.toast]:dark:!text-white group-[.toast]:dark:hover:!bg-[#2A3F6A] transition-colors duration-300",
          success: "group-[.toast]:!text-emerald-600 group-[.toast]:dark:!text-emerald-400",
          error: "group-[.toast]:!text-red-600 group-[.toast]:dark:!text-red-400",
          warning: "group-[.toast]:!text-amber-600 group-[.toast]:dark:!text-amber-400",
          info: "group-[.toast]:!text-blue-600 group-[.toast]:dark:!text-blue-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
