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

import Home from "./modules/main/views/Home";

import Loans from "./modules/loan/views/Loans";
import LoanDetails from "./modules/loan/views/LoanDetails";
import LoanMovements from "./modules/loan/views/LoanMovements";

import Profile from "./modules/user/views/Profile";
import MyData from "./modules/user/views/MyData";
import ChangeEmail from "./modules/user/views/ChangeEmail";
import ChangePhone from "./modules/user/views/ChangePhone";
import ChangeAddress from "./modules/user/views/ChangeAddress";

export const GlobalContext = React.createContext();

const App = () => {
  const [user, setUser] = useState(undefined);

  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, async (currentUser) => {
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

            <Route path="/home" element={<Home />} />

            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:uid" element={<LoanDetails />} />
            <Route path="/loans/:uid/movements" element={<LoanMovements />} />

            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/my-data" element={<MyData />} />
            <Route path="/user/change-email" element={<ChangeEmail />} />
            <Route path="/user/change-phone" element={<ChangePhone />} />
            <Route path="/user/change-address" element={<ChangeAddress />} />
          </Routes>
        </Content>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
