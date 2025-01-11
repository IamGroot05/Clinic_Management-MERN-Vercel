import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faHome, faUserCheck, faUserInfo, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function DocSideBar({ name }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/doc/dash", icon: faHome },
    { name: "Patient Checker", path: "/doc/pats", icon: faUserCheck },
    { name: "User Info", path: "/doc/docinfo", icon: faUserInfo },
  ];

  return (
    <div className="relative">
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-50">
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">Care Clinic</SheetTitle>
          </SheetHeader>
          <ul className="mt-6 space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg hover:bg-blue-500 transition ${
                      isActive ? "bg-blue-500" : ""
                    }`
                  }
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg" />
                  {item.name}
                </NavLink>
              </li>
            ))}
            <li>
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center"
                onClick={handleSignOut}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Sign Out
              </Button>
            </li>
          </ul>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col h-screen bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg w-64 fixed">
        <div className="flex items-center justify-center h-20">
          <h1 className="text-2xl font-bold">Care Clinic</h1>
        </div>
        <ul className="mt-8 space-y-4 px-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg hover:bg-blue-500 transition ${
                    isActive ? "bg-blue-500" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={item.icon} className="mr-3 text-lg" />
                {item.name}
              </NavLink>
            </li>
          ))}
          <li>
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center"
              onClick={handleSignOut}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Sign Out
            </Button>
          </li>
        </ul>
        <div className="mt-auto px-4 pb-6">
          <h2 className="text-lg font-semibold">{name}</h2>
        </div>
      </div>
    </div>
  );
}

export default DocSideBar;
