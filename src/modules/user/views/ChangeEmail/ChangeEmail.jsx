import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, InlineNotification, Button } from "@carbon/react";

import userService from "../../../user/user.service.js";

import { getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const ChangeEmail = () => {
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [changeEmailLoading, setChangeEmailLoading] = useState(false);
  const [changeEmailError, setChangeEmailError] = useState("");
  const [changeEmailMessage, setChangeEmailMessage] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user]);

  const handleChangeEmailSubmit = async (event) => {
    event.preventDefault();

    if (!email || email.trim().length === 0) {
      setInvalidEmail(true);
      return;
    }
    setInvalidEmail(false);

    setChangeEmailLoading(true);

    try {
      const { message } = await userService.changeEmail({
        authUid: user.uid,
        email,
      });

      setChangeEmailMessage(message);
    } catch (error) {
      setChangeEmailError(getMessageFromAxiosError(error));
    }

    setChangeEmailLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton useMarginTop={false} useMarginButtom={false} />
          <h3 className="screen__heading">Cambiar email</h3>
          <Form onSubmit={handleChangeEmailSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="email"
                labelText="Email"
                invalid={invalidEmail}
                invalidText="Valor inválido"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {changeEmailError && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="error"
                  iconDescription="close button"
                  subtitle={<span>{changeEmailError}</span>}
                  title="Uups!"
                  onClose={() => setChangeEmailError(undefined)}
                />
              </div>
            )}
            {changeEmailMessage && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="success"
                  iconDescription="close button"
                  subtitle={<span>{changeEmailMessage}</span>}
                  title="Cool!"
                  onClose={() => setChangeEmailMessage(undefined)}
                />
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={changeEmailLoading}
              >
                Cambiar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmail;
