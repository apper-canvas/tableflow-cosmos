import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import OrdersPage from "@/components/pages/OrdersPage";
import MenuPage from "@/components/pages/MenuPage";
import TablesPage from "@/components/pages/TablesPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/orders" replace />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="tables" element={<TablesPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="shadow-lg"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;