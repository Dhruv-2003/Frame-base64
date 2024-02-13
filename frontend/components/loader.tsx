import React from "react";
import { LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 grid place-items-center bg-black/70 backdrop-blur-xl z-50">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}
