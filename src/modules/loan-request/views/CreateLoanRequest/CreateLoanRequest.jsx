import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, InlineNotification, Button } from "@carbon/react";

import loanRequestService from "../../loan-request.service";

import { getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const CreateLoanRequest = () => {
  const [description, setDescription] = useState("");
  const [invalidDescription, setInvalidDescription] = useState(false);
  const [amount, setAmount] = useState("");
  const [invalidAmount, setInvalidAmount] = useState(false);

  const [createLoanRequestLoading, setCreateLoanRequestLoading] =
    useState(false);
  const [createLoanRequestError, setCreateLoanRequestError] =
    useState(undefined);
  const [createLoanRequestMessage, setCreateLoanRequestMessage] =
    useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user]);

  const handleCreateLoanRequestSubmit = async (event) => {
    event.preventDefault();

    // cleaning the messages
    setCreateLoanRequestError(undefined);
    setCreateLoanRequestMessage(undefined);

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

    setCreateLoanRequestLoading(true);

    try {
      const { message } = await loanRequestService.createLoanRequest({
        userAuthUid: user.uid,
        description,
        amount: parsedAmount,
      });
      setCreateLoanRequestMessage(message);
    } catch (error) {
      const errorMessage = getMessageFromAxiosError(error);

      if (errorMessage.includes("CREADA")) {
        setCreateLoanRequestError(
          "Ya tienes una solicitud de préstamo en curso"
        );
      } else {
        setCreateLoanRequestError(getMessageFromAxiosError(error));
      }
    }

    setCreateLoanRequestLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Crear solicitud</h3>
          <Form onSubmit={handleCreateLoanRequestSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="description"
                labelText="Descrpción / Motivo"
                invalid={invalidDescription}
                invalidText="Valor inválido"
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="amount"
                labelText="Monto"
                invalid={invalidAmount}
                invalidText="Valor inválido"
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            {createLoanRequestError && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="error"
                  icondescription="close button"
                  subtitle={createLoanRequestError}
                  title="Uups!"
                  onClose={() => setCreateLoanRequestError(undefined)}
                />
              </div>
            )}
            {createLoanRequestMessage && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="success"
                  icondescription="close button"
                  subtitle={createLoanRequestMessage}
                  title="Cool!"
                  onClose={() => setCreateLoanRequestMessage(undefined)}
                />
              </div>
            )}
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={createLoanRequestLoading}
              >
                Crear
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateLoanRequest;
