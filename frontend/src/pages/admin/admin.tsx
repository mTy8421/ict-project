import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/admin/navbar";
import type { User } from '../../types/home';

export default function admin() {
  return (
    <>
      <Navbar role="admin" name="test" />
    </>
  )
}
