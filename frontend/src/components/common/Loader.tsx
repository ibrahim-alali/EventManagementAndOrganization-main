import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
    text: string;
}

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
      <div
          className="flex h-96 items-center justify-center py-12 text-gray-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
          <span className="font-nata-sans-md text-sm">{text}</span>
      </div>
  )
};