import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  TextInput,
  InlineNotification,
  Button,
  InlineLoading,
  ActionableNotification,
} from "@carbon/react";

import loanRequestService from "../../loan-request.service";

import { getMessageFromAxiosError, delay } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const LoanRequestDetails = () => {
  const [description, setDescription] = useState("");
  const [invalidDescription, setInvalidDescription] = useState(false);
  const [amount, setAmount] = useState("");
  const [invalidAmount, setInvalidAmount] = useState(false);
  const [disabledButttons, setDisabledButtons] = useState(false);

  const [loanRequestLoading, setLoanRequestLoading] = useState(true);
  const [loanRequestError, setLoanRequestError] = useState("");

  const [updateLoanRequestLoading, setUpdateLoanRequestLoading] =
    useState(false);
  const [updateLoanRequestError, setUpdateLoanRequestError] =
    useState(undefined);
  const [updateLoanRequestMessage, setUpdateLoanRequestMessage] =
    useState(undefined);

  const [deletingLoanRequest, setDeletingLoanRequest] = useState(false);
  const [deletingLoanRequestLoading, setDeletingLoanRequestLoading] =
    useState(false);
  const [deleteLoanRequestError, setDeleteLoanRequestError] =
    useState(undefined);
  const [deleteLoanRequestMessage, setDeleteLoanRequestMessage] =
    useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchLoanRequest = async () => {
    setLoanRequestLoading(true);

    try {
      const [loanRequest] = await Promise.all([
        loanRequestService.getLoanRequest({
          loanRequestUid: uid,
        }),
        delay(),
      ]);

      setDescription(loanRequest?.description || "");
      setAmount(loanRequest?.amount + "" || "0");
      if (loanRequest?.status !== "CREADA") {
        setDisabledButtons(true);
      }
    } catch (error) {
      setLoanRequestError(getMessageFromAxiosError(error));
    }

    setLoanRequestLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoanRequest();
  }, [navigate, user, uid]);

  const cleanMessages = () => {
    // cleaning the messages
    setUpdateLoanRequestError(undefined);
    setUpdateLoanRequestError(undefined);
    setUpdateLoanRequestMessage(undefined);
    setDeleteLoanRequestError(undefined);
    setDeleteLoanRequestMessage(undefined);
  };

  const handleUpdateLoanRequestSubmit = async (event) => {
    event.preventDefault();

    // cleaning the messages
    cleanMessages();

    if (!description || description.trim().length === 0) {
      setInvalidDescription(true);
      return;
    }
    setInvalidDescription(false);

    if (!amount || amount.trim().length === 0) {
      setInvalidAmount(true);
      return;
    }

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount)) {
      setInvalidAmount(true);
      return;
    }
    setInvalidAmount(false);

    setUpdateLoanRequestLoading(true);

    try {
      const { message } = await loanRequestService.updateLoanRequest({
        loanRequestUid: uid,
        description,
        amount: parsedAmount,
      });
      setUpdateLoanRequestMessage(message);
    } catch (error) {
      setUpdateLoanRequestError(getMessageFromAxiosError(error));
    }

    setUpdateLoanRequestLoading(false);
  };

  const handleDeleteLoanRequestClick = async (event) => {
    event.preventDefault();

    // cleaning the messages
    cleanMessages();

    setDeletingLoanRequest(false);
    setDeletingLoanRequestLoading(true);

    try {
      const { message } = await loanRequestService.deleteLoanRequest({
        loanRequestUid: uid,
      });
      setDeleteLoanRequestMessage(message);
    } catch (error) {
      setDeleteLoanRequestError(getMessageFromAxiosError(error));
    }

    setDeletingLoanRequestLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Detalles de la solicitud</h3>
          {loanRequestLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loanRequestError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={loanRequestError}
                title="Uups!"
                onClose={() => setLoanRequestError(undefined)}
              />
            </div>
          )}
          {!loanRequestLoading && !loanRequestError && (
            <Form onSubmit={handleUpdateLoanRequestSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <TextInput
                  id="description"
                  labelText="Descrpción / Motivo"
                  invalid={invalidDescription}
                  invalidText="Valor inválido"
                  onChange={(event) => setDescription(event.target.value)}
                  value={description}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <TextInput
                  id="amount"
                  labelText="Monto"
                  invalid={invalidAmount}
                  invalidText="Valor inválido"
                  onChange={(event) => setAmount(event.target.value)}
                  value={amount}
                />
              </div>
              {updateLoanRequestError && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="error"
                    icondescription="close button"
                    subtitle={updateLoanRequestError}
                    title="Uups!"
                    onClose={() => setUpdateLoanRequestError(undefined)}
                  />
                </div>
              )}
              {updateLoanRequestMessage && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="success"
                    icondescription="close button"
                    subtitle={updateLoanRequestMessage}
                    title="Cool!"
                    onClose={() => setUpdateLoanRequestMessage(undefined)}
                  />
                </div>
              )}
              {deleteLoanRequestError && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="error"
                    icondescription="close button"
                    subtitle={deleteLoanRequestError}
                    title="Uups!"
                    onClose={() => setDeleteLoanRequestError(undefined)}
                  />
                </div>
              )}
              {deleteLoanRequestMessage && (
                <div style={{ marginBottom: "1rem" }}>
                  <InlineNotification
                    kind="success"
                    icondescription="close button"
                    subtitle={deleteLoanRequestMessage}
                    title="Cool!"
                    onClose={() => setDeleteLoanRequestMessage(undefined)}
                  />
                </div>
              )}
              {deletingLoanRequest && (
                <div style={{ marginBottom: "1rem" }}>
                  <ActionableNotification
                    kind="warning"
                    title="Confirmación!"
                    subtitle="Estas segur@?"
                    onClose={() => setDeletingLoanRequest(false)}
                    actionButtonLabel="Continuar"
                    onActionButtonClick={handleDeleteLoanRequestClick}
                  />
                </div>
              )}
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  className="btn-block"
                  type="submit"
                  size="sm"
                  disabled={disabledButttons || updateLoanRequestLoading}
                >
                  Actualizar solicitud
                </Button>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  className="btn-block"
                  size="sm"
                  kind="danger"
                  disabled={
                    disabledButttons ||
                    deletingLoanRequest ||
                    deletingLoanRequestLoading
                  }
                  onClick={() => setDeletingLoanRequest(true)}
                >
                  Eliminar solicitud
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanRequestDetails;
