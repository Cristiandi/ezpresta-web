import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Tag,
} from "@carbon/react";

import loanService from "../../../loan/loan.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  capitalizeFirstLetter,
  formatDate,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const LoanDetails = () => {
  const [loanDetails, setLoanDetails] = useState(undefined);
  const [loanDetailsLoading, setLoanDetailsLoading] = useState(true);
  const [loanDetailsError, setLoanDetailsError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchLoanDetails = async (uid) => {
    setLoanDetailsLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getLoanDetails({ uid }),
        delay(2000),
      ]);

      setLoanDetails(data);
    } catch (error) {
      setLoanDetailsError(getMessageFromAxiosError(error));
    }

    setLoanDetailsLoading(false);
  };

  // check if the user is logged in
  // if not, redirect to login page
  // and set the variables to the state
  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoanDetails(uid);
  }, [navigate, uid, user]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Detalles del prestamo</h3>
          {
            loanDetailsLoading &&
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          }
          {
            loanDetailsError &&
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanDetailsError}</span>}
                title="Uups!"
                onClose={() => setLoanDetailsError(undefined)}
              />
            </div>
          }
          {
            !loanDetailsLoading && !loanDetailsError && loanDetails &&
            <>
              <div className="cds--row">
                <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
                  <p className="loan-details__heading">
                    {capitalizeFirstLetter(loanDetails.description)}
                  </p>
                </div>
                <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
                  <p className="loan-details__label">Pago mínimo</p>
                  <h4 className="loan-details__amounts">
                    <strong>{formatCurrency(loanDetails.minimumLoanPaymentAmount)}</strong>
                  </h4>
                </div>
                <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
                  <p className="loan-details__label">Fecha de pago</p>
                  <p className="loan-details__payment_date">{formatDate(loanDetails.loanPaymentDate)}</p>
                </div>
                <div className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2">
                  <p className="loan-details__label">Valor solicitado</p>
                  <p className="loan-details__amounts">
                    <strong>{formatCurrency(loanDetails.amount)}</strong>
                  </p>
                </div>
                <div className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2">
                  <p className="loan-details__label">Saldo</p>
                  <p className="loan-details__amounts">
                    <strong>{formatCurrency(loanDetails.totalLoanAmount)}</strong>
                  </p>
                </div>
                <div className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2">
                  <p className="loan-details__label">Tasa efectiva mensual</p>
                  <p className="loan-details__amounts">
                    <strong>{loanDetails.monthlyInterestRate * 100}%</strong>
                  </p>
                </div>
                <div className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2">
                  <p className="loan-details__label">Tasa mora mensual</p>
                  <p className="loan-details__amounts">
                    <strong>{loanDetails.monthlyInterestOverdueRate * 100}%</strong>
                  </p>
                </div>
                <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4 loan-details__tag_container">
                  <Tag
                    type={loanDetails.loanPaymentStatus === "al día" ? "green" : "red"}
                    size="md"
                    title="Loan status tag">
                    {capitalizeFirstLetter(loanDetails.loanPaymentStatus)}
                  </Tag>
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default LoanDetails;
