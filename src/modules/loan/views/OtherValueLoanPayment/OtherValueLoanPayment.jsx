import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Button,
  TextInput,
} from "@carbon/react";
import { Chat } from "@carbon/icons-react";

import loanService from "../../loan.service";

import {
  delay,
  getMessageFromAxiosError,
  buildWhatsappLinkForCoordinationPaymentMessage,
  formatCurrency,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const MinimumLoanPayment = () => {
  const [loanDetails, setLoanDetails] = useState(undefined);
  const [loanDetailsLoading, setLoanDetailsLoading] = useState(true);
  const [loanDetailsError, setLoanDetailsError] = useState("");

  const [valueToPay, setValueToPay] = useState("");
  const [invalidValueToPay, setInvalidValueToPay] = useState(false);

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

    // console.log("ePayco", window.ePayco);
  }, [navigate, uid, user]);

  const handleCoordinatePaymentButtonClick = () => {
    if (valueToPay === "" || valueToPay.trim().length === 0) {
      setInvalidValueToPay(true);
      return;
    }
    setInvalidValueToPay(false);

    const parsedValueToPay = parseInt(valueToPay, 10);

    if (parsedValueToPay < loanDetails.minimumLoanPaymentAmount) {
      setInvalidValueToPay(true);
      return;
    }
    setInvalidValueToPay(false);

    if (parsedValueToPay > loanDetails.totalLoanAmount) {
      setInvalidValueToPay(true);
      return;
    }
    setInvalidValueToPay(false);

    const link = buildWhatsappLinkForCoordinationPaymentMessage({
      loanUid: loanDetails.uid,
      amount: parsedValueToPay,
    });
    window.open(link, "_blank");
    return;
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Pagar otro valor</h3>
          {loanDetailsLoading && (
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
          {!loanDetailsLoading && !loanDetailsError && loanDetails && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <div className="cds--row">
                  <div className="cds--col">
                    <p className="loan-details__label">Pago mínimo</p>
                    <p style={{ textAlign: "center" }}>
                      {formatCurrency(loanDetails.minimumLoanPaymentAmount)}
                    </p>
                  </div>
                  <div className="cds--col">
                    <p className="loan-details__label">Pago total</p>
                    <p style={{ textAlign: "center" }}>
                      {formatCurrency(loanDetails.totalLoanAmount)}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <TextInput
                  id="valueToPay"
                  labelText="Valor a pagar"
                  invalid={invalidValueToPay}
                  invalidText="Valor inválido"
                  onChange={(event) => setValueToPay(event.target.value)}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  className="btn-block"
                  size="sm"
                  style={{ width: "100%", maxWidth: "100%" }}
                  renderIcon={Chat}
                  onClick={handleCoordinatePaymentButtonClick}
                >
                  Coordinar pago
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimumLoanPayment;
