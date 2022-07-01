import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InlineLoading, InlineNotification, Button } from "@carbon/react";
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
    const link = buildWhatsappLinkForCoordinationPaymentMessage({
      loanUid: loanDetails.uid,
      amount: loanDetails.totalLoanAmount,
    });
    window.open(link, "_blank");
    return;
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Pago total</h3>
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
                    <p className="loan-details__label">Pago total</p>
                    <p style={{ textAlign: "center" }}>
                      {formatCurrency(loanDetails.totalLoanAmount)}
                    </p>
                  </div>
                </div>
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
