import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import BanksPage from "../pages/BanksPage";
import CardsPage from "../pages/CardsPage";
import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import MerchantsPage from "../pages/MerchantsPage";
import ProtectedRoute from "./ProtectedRoute";
import BankCardsPage from "../pages/BankCardsPage";
import TransactionsPage from "../pages/TransactionsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/banks" element={<BanksPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/merchants" element={<MerchantsPage />} />
          <Route path="/banks/:bankId/cards" element={<BankCardsPage />}/>
          <Route path="/transactions" element={<TransactionsPage />}
/> 
        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;