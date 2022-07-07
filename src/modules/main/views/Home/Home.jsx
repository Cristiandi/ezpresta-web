import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { InlineLoading, Button } from "@carbon/react";
import { ChevronRight } from "@carbon/icons-react";

import userService from "../../../user/user.service";
import authService from "../../../auth/auth.service";
import loanService from "../../../loan/loan.service";

import { delay } from "../../../../utils";

import LoanCard from "../../../../components/LoanCard";

import { GlobalContext } from "../../../../App.jsx";

const formatFirstName = (fullName) => {
  const names = fullName.split(" ");
  return names[0];
};

const greet = () => {
  const d = new Date();
  const hour = d.getHours();

  if (hour < 12) {
    return "Buenos días";
  }
  if (hour >= 12 && hour < 18) {
    return "Buenas tardes";
  }
  if (hour >= 18) {
    return "Buenas noches";
  }
};

const Home = () => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);

  const [loansInfo, setLoansInfo] = useState([]);
  const [loadingLoansInfo, setLoadingLoansInfo] = useState(true);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const fetchUserInfo = async (user) => {
    setLoadingUserInfo(true);

    try {
      const [data] = await Promise.all([
        userService.getOne({ authUid: user.uid }),
        delay(),
      ]);

      setUserInfo(data);
    } catch (error) {
      await authService.logout();
    }

    setLoadingUserInfo(false);
  };

  const fetchLoansInfo = async (user) => {
    setLoadingLoansInfo(true);

    try {
      const [data] = await Promise.all([
        loanService.getUserLoans({ userAuthUid: user.uid, limit: 2 }),
        delay(),
      ]);

      setLoansInfo(data);
    } catch (error) {
      await authService.logout();
    }

    setLoadingLoansInfo(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchUserInfo(user);
    fetchLoansInfo(user);
  }, [navigate, user]);

  const handleViewAllLoansButtonClick = () => {
    return navigate("/loans");
  };

  const handleViewLoanRequestButtonClick = () => {
    return navigate("/loan-requests");
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          {(loadingUserInfo || loadingLoansInfo) && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {!loadingUserInfo && !loadingLoansInfo && userInfo && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <p>{greet()}</p>
                <h3>{formatFirstName(userInfo.fullName)}</h3>
              </div>
              {!loansInfo.length && (
                <div style={{ marginBottom: "1rem" }}>
                  <p>Aún no tienes préstamos</p>
                </div>
              )}
              {loansInfo.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  {loansInfo.map((loanInfo, index) => {
                    if (!index) {
                      return <LoanCard key={loanInfo.id} {...loanInfo} />;
                    }
                  })}
                </div>
              )}
              {loansInfo.length > 1 && (
                <div style={{ marginBottom: "1rem" }}>
                  <Button
                    kind="ghost"
                    size="sm"
                    label="Ver todos"
                    iconDescription="Ver todos"
                    renderIcon={ChevronRight}
                    onClick={handleViewAllLoansButtonClick}
                  >
                    Tús prestamos
                  </Button>
                </div>
              )}
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="ghost"
                  size="sm"
                  label="Solicitudes de préstamo"
                  iconDescription="Solicitudes de préstamo"
                  renderIcon={ChevronRight}
                  onClick={handleViewLoanRequestButtonClick}
                >
                  Solicitudes de préstamo
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
