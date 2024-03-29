import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Button,
  TextInput,
} from "@carbon/react";
import { Chat, Currency } from "@carbon/icons-react";

import environment from "../../../../environment";

import userService from "../../../user/user.service";
import loanService from "../../loan.service";

import {
  delay,
  getMessageFromAxiosError,
  buildWhatsappLinkForCoordinationPaymentMessage,
  formatCurrency,
  shouldUseEpayco,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const MinimumLoanPayment = () => {
  const [loanDetails, setLoanDetails] = useState(undefined);
  const [loanDetailsLoading, setLoanDetailsLoading] = useState(true);
  const [loanDetailsError, setLoanDetailsError] = useState(undefined);

  const [userInfo, setUserInfo] = useState(undefined);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [userInfoError, setUserInfoError] = useState(undefined);

  const [valueToPay, setValueToPay] = useState("");
  const [invalidValueToPay, setInvalidValueToPay] = useState(false);

  const [createEpaycoTransactionLoading, setCreateEpaycoTransactionLoading] =
    useState(false);
  const [createEpaycoTransactionError, setCreateEpaycoTransactionError] =
    useState(undefined);

  const [ePaycoHandler, setePaycoHandler] = useState(undefined);

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

  const fetchUserInfo = async (user) => {
    setUserInfoLoading(true);

    try {
      const [data] = await Promise.all([
        userService.getOne({ authUid: user.uid }),
        delay(),
      ]);

      setUserInfo(data);
    } catch (error) {
      setUserInfoError(getMessageFromAxiosError(error));
    }

    setUserInfoLoading(false);
  };

  // check if the user is logged in
  // if not, redirect to login page
  // and set the variables to the state
  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    setePaycoHandler(
      window.ePayco.checkout.configure({
        key: environment.EPAYCO_PUBLIC_KEY,
        test: environment.EPAYCO_TESTING,
      })
    );

    fetchLoanDetails(uid);
    fetchUserInfo(user);
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

  const handlePaymentWithEPaycoButtonClick = async () => {
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

    setCreateEpaycoTransactionLoading(true);

    let epaycoTransaction;

    // create the epayco transaction in the backend
    try {
      epaycoTransaction = await loanService.createEpaycoTransaction({
        amount: valueToPay,
        uid,
      });
    } catch (error) {
      setCreateEpaycoTransactionError(getMessageFromAxiosError(error));
      return;
    }

    // define ther data for epayco checkout
    const data = loanService.prepareEPaycoData({
      invoice: epaycoTransaction?.uid,
      amount: valueToPay,
      name_billing: userInfo?.fullName,
      address_billing: userInfo?.address,
      mobilephone_billing: userInfo?.phone,
      number_doc_billing: userInfo?.documentNumber,
    });

    await ePaycoHandler.open(data);

    // setCreateEpaycoTransactionLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Pagar otro valor</h3>
          {(loanDetailsLoading || userInfoLoading) && (
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
          {userInfoError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{userInfoError}</span>}
                title="Uups!"
                onClose={() => setUserInfoError(undefined)}
              />
            </div>
          )}
          {!loanDetailsLoading &&
            !loanDetailsError &&
            loanDetails &&
            !userInfoLoading &&
            !userInfoError &&
            userInfo && (
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
                {createEpaycoTransactionError && (
                  <div style={{ marginBottom: "1rem" }}>
                    <InlineNotification
                      kind="error"
                      iconDescription="close button"
                      subtitle={<span>{createEpaycoTransactionError}</span>}
                      title="Uups!"
                      onClose={() => setCreateEpaycoTransactionError(undefined)}
                    />
                  </div>
                )}
                {shouldUseEpayco(valueToPay) && (
                  <div style={{ marginBottom: "1rem" }}>
                    <Button
                      className="btn-block"
                      size="sm"
                      kind="secondary"
                      style={{ width: "100%", maxWidth: "100%" }}
                      renderIcon={Currency}
                      disabled={createEpaycoTransactionLoading}
                      onClick={handlePaymentWithEPaycoButtonClick}
                    >
                      Pagar con EPAYCO
                    </Button>
                  </div>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default MinimumLoanPayment;
