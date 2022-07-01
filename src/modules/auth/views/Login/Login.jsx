import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
} from "@carbon/react";

import authService from "../../auth.service";

import { GlobalContext } from "../../../../App.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (user) {
      return navigate("/home");
    }
  }, [navigate, user]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    if (!email || email.trim().length === 0) {
      setInvalidEmail(true);
      return;
    }
    setInvalidEmail(false);

    if (!password || password.trim().length === 0) {
      setInvalidPassword(true);
      return;
    }
    setInvalidPassword(false);

    setLoginLoading(true);

    try {
      await authService.login({
        email,
        password,
      });
    } catch (error) {
      setLoginError(error.message);
    }

    setLoginLoading(false);
  };

  const handleLoginWithGoogle = async () => {
    setLoginLoading(true);

    try {
      await authService.loginWithGoogle();
    } catch (error) {
      setLoginError(error.message);
    }

    setLoginLoading(false);
  };

  const handleForgottenPasswordButtonClick = () => {
    return navigate("/reset-password");
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <Form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="email"
                labelText="Email"
                invalid={invalidEmail}
                invalidText="Valor inválido"
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <PasswordInput
                id="password"
                labelText="Contraseña"
                invalid={invalidPassword}
                invalidText="Valor inválido"
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {loginError && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="error"
                  iconDescription="close button"
                  subtitle={<span>{loginError}</span>}
                  title="Uups!"
                  onClose={() => setLoginError(undefined)}
                />
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={loginLoading}
              >
                Inicia sesión
              </Button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                size="sm"
                kind="secondary"
                disabled={loginLoading}
                onClick={handleLoginWithGoogle}
              >
                Google
              </Button>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                size="sm"
                kind="tertiary"
                disabled={loginLoading}
                onClick={handleForgottenPasswordButtonClick}
              >
                No recuerdas tu contraseña?
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
