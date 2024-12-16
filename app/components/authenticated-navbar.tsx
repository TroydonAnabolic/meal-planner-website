// components/Navbar.tsx
"use client";

import React, { useState } from "react";
import MainSearchMenu from "./main-search-menu";
import SideBar from "./side-bar";

const AuthenticatedNavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Static sidebar for desktop */}
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MainSearchMenu setSidebarOpen={setSidebarOpen} />
    </>
  );
};

export default AuthenticatedNavBar;
