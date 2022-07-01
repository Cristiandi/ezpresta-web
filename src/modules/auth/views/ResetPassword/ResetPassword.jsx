import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, Button, InlineNotification } from "@carbon/react";

import authService from "../../auth.service";

import { getMessageFromAxiosError } from "../../../../utils";

import { GlobalContext } from "../../../../App.jsx";

const ResetPassword = () => {
  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (user) {
      return navigate("/home");
    }
  }, [navigate, user]);

  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);

  const [resetPasswordEmailError, setResetPasswordEmailError] = useState("");

  const [resetPasswordEmailMessage, setResetPasswordEmailMessage] =
    useState("");

  const handleResetPasswordSubmit = async (event) => {
    event.preventDefault();

    if (!email || email.trim().length === 0) {
      setInvalidEmail(true);
      return;
    }
    setInvalidEmail(false);

    try {
      const { message } = await authService.sendResetPasswordEmail({
        email,
      });

      setResetPasswordEmailMessage(message);
    } catch (error) {
      resetPasswordEmailError(getMessageFromAxiosError(error));
    }
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <Form onSubmit={handleResetPasswordSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="email"
                labelText="Email"
                invalid={invalidEmail}
                invalidText="Valor inválido"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            {resetPasswordEmailError && (
              <div>
                <InlineNotification
                  kind="error"
                  iconDescription="close button"
                  subtitle={<span>{resetPasswordEmailError}</span>}
                  title="Uups!"
                  onClose={() => setResetPasswordEmailError("")}
                />
              </div>
            )}

            {resetPasswordEmailMessage && (
              <div>
                <InlineNotification
                  kind="success"
                  iconDescription="close button"
                  subtitle={<span>{resetPasswordEmailMessage}</span>}
                  title="Cool!"
                  onClose={() => setResetPasswordEmailMessage(undefined)}
                />
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <Button className="btn-block" type="submit" size="sm">
                Enviar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
