import { IoMdAlert } from "react-icons/io";
import React from "react";

export default function FormAlert({ children }) {
  return (
    <div className="alert shadow-lg alert-warning">
      <div>
        <IoMdAlert />
        <span>{children}</span>
      </div>
    </div>
  );
}
