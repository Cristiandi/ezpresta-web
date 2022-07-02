import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InlineLoading, InlineNotification } from "@carbon/react";

import loanService from "../../../loan/loan.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";

import LoanCard from "../../../../components/LoanCard";
import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const Loans = () => {
  const [loansInfo, setLoansInfo] = useState([]);
  const [loansInfoLoading, setLoansInfoLoading] = useState(true);
  const [loansInfoError, setLoansInfoError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const fetchLoansInfo = async (user) => {
    setLoansInfoLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getUserLoans({ userAuthUid: user.uid }),
        delay(),
      ]);

      setLoansInfo(data);
    } catch (error) {
      setLoansInfoError(getMessageFromAxiosError(error));
    }

    setLoansInfoLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoansInfo(user);
  }, [navigate, user]);
  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Tús prestamos</h3>
          {loansInfoLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loansInfoError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loansInfoError}</span>}
                title="Uups!"
                onClose={() => setLoansInfoError(undefined)}
              />
            </div>
          )}
          {!loansInfoLoading && !loansInfoError && loansInfo && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                {loansInfo.map((loanInfo) => {
                  return <LoanCard key={loanInfo.id} {...loanInfo} />;
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loans;
