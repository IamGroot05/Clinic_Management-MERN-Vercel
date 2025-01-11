import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronRight,
  faChevronLeft,
  faHome,
  faUserCheck,
  faUserNurse,
  faSignOutAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AppRoutesEnum } from "@/shared/appRoutes";

function SideBarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location =useLocation();
  const [user] = useLocalStorage<any>("res");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: AppRoutesEnum.LANDING_PAGE, icon: faHome, isActive: true },
    { name: "Patient Register", path: AppRoutesEnum.ADD_PATIENT, icon: faUserPlus, isActive: false },
    { name: "Patient Checker", path: AppRoutesEnum.PATIENT_CHECKER, icon: faUserCheck, isActive: false },
    { name: "User Info", path: AppRoutesEnum.PROFILE, icon: faUserNurse, isActive: false },
  ];

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar (Drawer) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed top-4 left-4 z-50">
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-gradient-to-r from-slate-200 to-emerald-100 font-[OpenSansMedium] text-[var(--primary)] p-4"
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-[var(--primary)]">Care Clinic</SheetTitle>
          </SheetHeader>
          <ul className="mt-6 space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={
                    `flex items-center px-4 py-2 rounded-lg hover:bg-emerald-700 hover:text-white transition ${
                      location.pathname === item.path ? "bg-emerald-700 text-white" : ""
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
      <div
        className={`hidden lg:flex flex-col bg-gradient-to-r from-slate-200 to-emerald-100 font-[OpenSansMedium] text-[var(--primary)] shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-4">
          {!isCollapsed && <h1 className="text-2xl font-bold">Care Clinic</h1>}
          <Button
            variant="ghost"
            className="text-lg"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
          </Button>
        </div>
        <ul className="mt-8 space-y-4 px-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={
                  `flex items-center px-4 py-2 rounded-lg hover:bg-[#0478578f] hover:text-white transition ${
                   location.pathname === item.path ? "bg-emerald-700 text-white" : ""
                  }`
                }
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`mr-3 text-lg ${isCollapsed ? "mr-0" : ""}`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
          <li>
            <Button
              variant="destructive"
              className={`flex absolute bottom-4  items-center justify-center ${isCollapsed ? "justify-center" : ""}`}
              onClick={handleSignOut}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </li>
        </ul>
        {!isCollapsed && (
          <div className="mt-auto px-4 pb-6">
            <h2 className="text-lg font-semibold">{user?.name}</h2>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-white overflow-auto">{children}</div>
    </div>
  );
}

export default SideBarLayout;
