import React from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/home";
import AdminUser from "./work";
export default function admin() {
  return (
    <>
      <div>
        <AdminUser />
      </div>
    </>
  );
}
