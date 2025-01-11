import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Login from '@/view/auth/Login';
import { AppRoutesEnum } from '@/shared/appRoutes';
import Landing from '@/view/Landing';
import SideBar from '@/components/sideBar';
import PatientChecker from '@/view/doctor/patientChecker';
import UserInfo from '@/view/UserInfo';
import PatientAdd from '@/view/receptionist/AddPatient';

const RouteHandler = () => {
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const localData = localStorage.getItem("res");
    if (!localData) {
      navigate(AppRoutesEnum.LOGIN);
    } else {
      const parsedData = JSON.parse(localData);
      setUser(parsedData?.data || null);
      navigate(location.pathname)
    }
  }, [navigate]);

  const canActiveRouteBeAccessed = (route: AppRoutesEnum) => {
    if (user?.role === "doctor") {
      return true;
    }
    if (user?.role === "recept" && route === AppRoutesEnum.LANDING_PAGE) {
      return true;
    }
    return false;
  };

  const AuthGuard = () => {
    if (user?.role) {
      if (canActiveRouteBeAccessed(location.pathname as AppRoutesEnum)) {
        return  <SideBar><Outlet /></SideBar>
;
      } else {
        return <Navigate to={AppRoutesEnum.LANDING_PAGE} />;
      }
    }
    return <Navigate to={AppRoutesEnum.LOGIN} />;
  };

  return (
    <div className="app-main" style={{ background: '#f2f2f2' }}>
      <Routes>
        {/* Public Routes */}
        <Route path={AppRoutesEnum.LOGIN} element={<Login />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Navigate to={AppRoutesEnum.LANDING_PAGE} />} />
          <Route path={AppRoutesEnum.LANDING_PAGE} element={<Landing/>} />
          <Route path={AppRoutesEnum.PATIENT_CHECKER} element={<PatientChecker />} />
          <Route path={AppRoutesEnum.PROFILE} element={<UserInfo />} />
          <Route path={AppRoutesEnum.ADD_PATIENT} element={<PatientAdd />} />
          {/* <Route path="/:module/*" element={<ModuleRoutes />} /> */}

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to={AppRoutesEnum.LANDING_PAGE} />} />
        </Route>
      </Routes>
    </div>
  );
};

// Component to handle module-specific routes
const ModuleRoutes = () => {
  const { module } = useParams<{ module: string }>();

  // Validate if the module is recognized
  const isValidModule = Object.values(AppRoutesEnum).includes(module as AppRoutesEnum);

  if (!isValidModule) {
    return <Navigate to={AppRoutesEnum.LANDING_PAGE} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={AppRoutesEnum.LANDING_PAGE} />} />
      <Route path={AppRoutesEnum.PATIENT_CHECKER} element={<PatientChecker />} />
      {/* Add module-specific routes here */}
      {/* Example: 
      */}
    </Routes>
  );
};

export default RouteHandler;
