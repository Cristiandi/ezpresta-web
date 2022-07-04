import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InlineLoading, InlineNotification, Button } from "@carbon/react";
import { CertificateCheck } from "@carbon/icons-react";

import loanService from "../../loan.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";

import { GlobalContext } from "../../../../App.jsx";

const EpaycoResponse = () => {
  const [ePaycoTransaction, setEPaycoTransaction] = useState(null);
  const [ePaycoTransactionLoading, setEPaycoTransactionLoading] =
    useState(false);
  const [ePaycoTransactionError, setEPaycoTransactionError] =
    useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const [searchParams] = useSearchParams();

  const ePaycoRef = searchParams.get("ref_payco");

  const fetchPaycoTransaction = async (ePaycoRef) => {
    setEPaycoTransactionLoading(true);

    try {
      const [data] = await Promise.all([
        loanService.getEpaycoTrasaction({ ePaycoRef }),
        delay(),
      ]);

      setEPaycoTransaction(data);
    } catch (error) {
      setEPaycoTransactionError(getMessageFromAxiosError(error));
    }

    setEPaycoTransactionLoading(false);
  };

  // check if the user is logged in
  // if not, redirect to login page
  // and set the variables to the state
  useEffect(() => {
    if (!ePaycoRef) {
      navigate("/");
    }

    fetchPaycoTransaction(ePaycoRef);
  }, [navigate, user]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <h3 className="screen__heading">Detalles del pago en EPayco</h3>
          {ePaycoTransactionLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {ePaycoTransactionError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{ePaycoTransactionError}</span>}
                title="Uups!"
                onClose={() => setEPaycoTransactionError(undefined)}
              />
            </div>
          )}
          {!ePaycoTransactionLoading &&
            !ePaycoTransactionError &&
            ePaycoTransaction && (
              <>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <p>Fecha:</p>
                  </div>
                  <div className="cds--col">
                    <p>{ePaycoTransaction.x_transaction_date}</p>
                  </div>
                </div>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <p>Respuesta:</p>
                  </div>
                  <div className="cds--col">
                    <p>{ePaycoTransaction.x_response}</p>
                  </div>
                </div>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <p>Referencia:</p>
                  </div>
                  <div className="cds--col">
                    <p>{ePaycoTransaction.x_id_invoice}</p>
                  </div>
                </div>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <p>Motivo:</p>
                  </div>
                  <div className="cds--col">
                    <p>{ePaycoTransaction.x_response_reason_text}</p>
                  </div>
                </div>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <p>Recibo:</p>
                  </div>
                  <div className="cds--col" style={{ marginBottom: "1rem" }}>
                    <p>{ePaycoTransaction.x_transaction_id}</p>
                  </div>
                </div>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <p>Autorizacion:</p>
                  </div>
                  <div className="cds--col" style={{ marginBottom: "1rem" }}>
                    <p>{ePaycoTransaction.x_approval_code}</p>
                  </div>
                </div>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <p>Total:</p>
                  </div>
                  <div className="cds--col">
                    <p>
                      {ePaycoTransaction.x_amount +
                        " " +
                        ePaycoTransaction.x_currency_code}
                    </p>
                  </div>
                </div>
                <div className="cds--row" style={{ marginBottom: "1rem" }}>
                  <div className="cds--col">
                    <Button
                      className="btn-block"
                      size="sm"
                      style={{ width: "100%", maxWidth: "100%" }}
                      onClick={() => navigate("/home")}
                      renderIcon={CertificateCheck}
                    >
                      Aceptar
                    </Button>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default EpaycoResponse;
