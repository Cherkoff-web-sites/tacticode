import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { Modals } from "./components/Modals";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { ContactsPage } from "./pages/ContactsPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { UserAgreementPage } from "./pages/UserAgreementPage";
import { AdminPage } from "./pages/AdminPage";
import { LkPage } from "./LkPage";

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<UserAgreementPage />} />
            <Route path="lk" element={<LkPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
        <Modals />
      </AppProvider>
    </BrowserRouter>
  );
}
