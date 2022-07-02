import React, { useState } from "react";
import { Content, Theme } from "@carbon/react";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./app.scss";

import firebaseApp from "./firebase";

import AppHeader from "./components/AppHeader";

import Landing from "./modules/main/views/Landing";

import Register from "./modules/auth/views/Register";
import Login from "./modules/auth/views/Login";
import ResetPassword from "./modules/auth/views/ResetPassword";

import Home from "./modules/main/views/Home";

import Loans from "./modules/loan/views/Loans";
import LoanDetails from "./modules/loan/views/LoanDetails";
import LoanMovements from "./modules/loan/views/LoanMovements";
import MinimumLoanPayment from "./modules/loan/views/MinimumLoanPayment";
import TotalLoanPayment from "./modules/loan/views/TotalLoanPayment";
import OtherValueLoanPayment from "./modules/loan/views/OtherValueLoanPayment";

import LoanRequests from "./modules/loan-request/views/LoanRequests";
import CreateLoanRequest from "./modules/loan-request/views/CreateLoanRequest";

import Profile from "./modules/user/views/Profile";
import MyData from "./modules/user/views/MyData";
import ChangeEmail from "./modules/user/views/ChangeEmail";
import ChangePhone from "./modules/user/views/ChangePhone";
import ChangeAddress from "./modules/user/views/ChangeAddress";
import Security from "./modules/user/views/Security";
import ChangePassword from "./modules/user/views/ChangePassword";

export const GlobalContext = React.createContext();

const App = () => {
  const [user, setUser] = useState(undefined);

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return (
    <>
      <GlobalContext.Provider value={{ user }}>
        <Theme theme="g100">
          <AppHeader />
        </Theme>
        <Content>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/home" element={<Home />} />

            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:uid" element={<LoanDetails />} />
            <Route path="/loans/:uid/movements" element={<LoanMovements />} />
            <Route
              path="/loans/:uid/minimum-loan-payment"
              element={<MinimumLoanPayment />}
            />
            <Route
              path="/loans/:uid/total-loan-payment"
              element={<TotalLoanPayment />}
            />
            <Route
              path="/loans/:uid/other-value-loan-payment"
              element={<OtherValueLoanPayment />}
            />

            <Route path="/loan-requests" element={<LoanRequests />} />
            <Route
              path="/loan-requests/create"
              element={<CreateLoanRequest />}
            />

            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/my-data" element={<MyData />} />
            <Route path="/user/change-email" element={<ChangeEmail />} />
            <Route path="/user/change-phone" element={<ChangePhone />} />
            <Route path="/user/change-address" element={<ChangeAddress />} />
            <Route path="/user/security" element={<Security />} />
            <Route path="/user/change-password" element={<ChangePassword />} />
          </Routes>
        </Content>
      </GlobalContext.Provider>
    </>
  );
};

export default App;
