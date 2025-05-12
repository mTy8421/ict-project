import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/home';
import Navbar from "../../components/user/navbar";
import { HomeUser } from "../../components/user/content";

export default function UserHome() {
  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
            <Navbar role="พนักงาน" name="พนักงาน" />
          </div>
      <div className="flex-1 overflow-auto p-4">
          <HomeUser name="Profile" />
        </div>
      </div>
  );
}
