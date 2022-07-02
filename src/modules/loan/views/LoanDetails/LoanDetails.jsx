import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Tag,
  Button,
  IconButton,
} from "@carbon/react";
import { ChevronRight, Money } from "@carbon/icons-react";

import loanService from "../../../loan/loan.service";
import movementService from "../../../movement/movement.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  capitalizeFirstLetter,
  formatDate,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";
import PaymentListItem from "../../../../components/PaymentListItem";

import { GlobalContext } from "../../../../App.jsx";

const LoanDetails = () => {
  const [loanDetails, setLoanDetails] = useState(undefined);
  const [loanDetailsLoading, setLoanDetailsLoading] = useState(true);
  const [loanDetailsError, setLoanDetailsError] = useState("");

  const [loanPayments, setLoanPayments] = useState([]);
  const [loanPaymentsLoading, setLoanPaymentsLoading] = useState(true);
  const [loanPaymentsError, setLoanPaymentsError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchLoanDetails = async (uid) => {
    setLoanDetailsLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getLoanDetails({ uid }),
        delay(),
      ]);

      setLoanDetails(data);
    } catch (error) {
      setLoanDetailsError(getMessageFromAxiosError(error));
    }

    setLoanDetailsLoading(false);
  };

  const fetchLoanPayments = async (uid) => {
    setLoanPaymentsLoading(true);

    try {
      const [data] = await Promise.all([
        movementService.getLoanPayments({ uid, limit: 3 }),
        delay(),
      ]);

      setLoanPayments(data);
    } catch (error) {
      setLoanPaymentsError(getMessageFromAxiosError(error));
    }

    setLoanPaymentsLoading(false);
  };

  // check if the user is logged in
  // if not, redirect to login page
  // and set the variables to the state
  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoanDetails(uid);
    fetchLoanPayments(uid);
  }, [navigate, uid, user]);

  const handleViewAllLoanMovementsButtonClick = (uid) => {
    return navigate(`/loans/${uid}/movements`);
  };

  const handleMinumumLoanPaymentButtonClick = (uid) => {
    return navigate(`/loans/${uid}/minimum-loan-payment`);
  };

  const handleTotalLoanPaymentButtonClick = (uid) => {
    return navigate(`/loans/${uid}/total-loan-payment`);
  };

  const handleOtherValueLoanPaymentButtonClick = (uid) => {
    return navigate(`/loans/${uid}/other-value-loan-payment`);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Detalles del prestamo</h3>
          {(loanDetailsLoading || loanPaymentsLoading) && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loanDetailsError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanDetailsError}</span>}
                title="Uups!"
                onClose={() => setLoanDetailsError(undefined)}
              />
            </div>
          )}
          {loanPaymentsError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanPaymentsError}</span>}
                title="Uups!"
                onClose={() => setLoanPaymentsError("")}
              />
            </div>
          )}
          {!loanDetailsLoading &&
            !loanDetailsError &&
            loanDetails &&
            !loanPaymentsLoading &&
            !loanPaymentsError &&
            loanPayments && (
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
                      <strong>
                        {formatCurrency(loanDetails.minimumLoanPaymentAmount)}
                      </strong>
                    </h4>
                  </div>
                  <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
                    <p className="loan-details__label">Fecha de pago</p>
                    <p className="loan-details__payment_date">
                      {formatDate(loanDetails.loanPaymentDate)}
                    </p>
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
                      <strong>
                        {formatCurrency(loanDetails.totalLoanAmount)}
                      </strong>
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
                      <strong>
                        {loanDetails.monthlyInterestOverdueRate * 100}%
                      </strong>
                    </p>
                  </div>
                  <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4 loan-details__tag_container">
                    <Tag
                      type={
                        loanDetails.loanPaymentStatus === "al día"
                          ? "green"
                          : "red"
                      }
                      size="md"
                      title="Loan status tag"
                    >
                      {capitalizeFirstLetter(loanDetails.loanPaymentStatus)}
                    </Tag>
                  </div>
                  <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
                    <div className="cds--row">
                      <div className="cds--col">
                        <p className="loan-details__label">Pago minimo</p>
                      </div>
                      <div className="cds--col">
                        <p className="loan-details__label">Otro valor</p>
                      </div>
                      <div className="cds--col">
                        <p className="loan-details__label">Pago total</p>
                      </div>
                    </div>
                    <div className="cds--row">
                      <div className="cds--col loan-details__payment_button_container">
                        <IconButton
                          kind="ghost"
                          size="lg"
                          label="Pago minimo"
                          iconDescription="Pago minimo"
                          disabled={loanDetails.minimumLoanPaymentAmount < 1}
                          renderIcon={Money}
                          onClick={() =>
                            handleMinumumLoanPaymentButtonClick(uid)
                          }
                        />
                      </div>
                      <div className="cds--col loan-details__payment_button_container">
                        <IconButton
                          kind="ghost"
                          size="lg"
                          label="Otro valor"
                          iconDescription="Otro valor"
                          renderIcon={Money}
                          onClick={() =>
                            handleOtherValueLoanPaymentButtonClick(uid)
                          }
                        />
                      </div>
                      <div className="cds--col loan-details__payment_button_container">
                        <IconButton
                          kind="ghost"
                          size="lg"
                          label="Pago total"
                          iconDescription="Pago total"
                          renderIcon={Money}
                          onClick={() => handleTotalLoanPaymentButtonClick(uid)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cds--row">
                  <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
                    <div style={{ marginBottom: "1rem" }}>
                      <p>Pagos</p>
                    </div>
                    {loanPayments.length > 0 && (
                      <div>
                        <div>
                          {loanPayments.map((payment) => {
                            return (
                              <PaymentListItem
                                key={payment.id}
                                amount={payment.amount}
                                at={payment.at}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {!loanPayments.length && (
                      <div style={{ marginBottom: "1rem" }}>
                        <p>Aún no has realizado pagos.</p>
                      </div>
                    )}
                    <div style={{ marginBottom: "1rem" }}>
                      <Button
                        kind="ghost"
                        size="sm"
                        label="Ver todos"
                        iconDescription="Ver todos"
                        renderIcon={ChevronRight}
                        onClick={() =>
                          handleViewAllLoanMovementsButtonClick(uid)
                        }
                      >
                        Ver todos los movimientos
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
