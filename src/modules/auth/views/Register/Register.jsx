import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
} from "@carbon/react";

import userService from "../../../user/user.service.js";

import { getMessageFromAxiosError } from "../../../../utils";

import { GlobalContext } from "../../../../App.jsx";

const Register = () => {
  const [documentNumber, setDocumentNumber] = useState("");
  const [invalidDocumentNumber, setInvalidDocumentNumber] = useState(false);
  const [fullName, setFullName] = useState("");
  const [invalidFullName, setInvalidFullName] = useState(false);
  const [phone, setPhone] = useState("");
  const [invalidPhone, setInvalidPhone] = useState(false);
  const [address, setAddress] = useState("");
  const [invalidAddress, setInvalidAddress] = useState(false);
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);

  const [registerError, setRegisterError] = useState(undefined);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (user) {
      return navigate("/home");
    }
  }, [navigate, user]);

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (!documentNumber || documentNumber.trim().length === 0) {
      setInvalidDocumentNumber(true);
      return;
    }
    if (isNaN(parseInt(documentNumber, 10))) {
      setInvalidDocumentNumber(true);
      return;
    }
    setInvalidDocumentNumber(false);

    if (!fullName || fullName.trim().length === 0) {
      setInvalidFullName(true);
      return;
    }
    setInvalidFullName(false);

    if (!phone || phone.trim().length === 0) {
      setInvalidPhone(true);
      return;
    }
    if (isNaN(parseInt(phone, 10))) {
      setInvalidPhone(true);
      return;
    }
    setInvalidPhone(false);

    if (!address || address.trim().length === 0) {
      setInvalidAddress(true);
      return;
    }
    setInvalidAddress(false);

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

    if (!confirmPassword || confirmPassword.trim().length === 0) {
      setInvalidConfirmPassword(true);
      return;
    }
    setInvalidConfirmPassword(false);

    if (password !== confirmPassword) {
      setInvalidConfirmPassword(true);
      return;
    }
    setInvalidConfirmPassword(false);

    setRegisterLoading(true);

    try {
      const { message } = await userService.createBorrower({
        documentNumber,
        fullName,
        phone,
        address,
        email,
        password,
      });

      setRegisterMessage(message);
    } catch (error) {
      setRegisterError(getMessageFromAxiosError(error));
    }

    setRegisterLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <Form onSubmit={handleRegisterSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="documentNumber"
                labelText="Número de documento"
                invalid={invalidDocumentNumber}
                invalidText="Valor inválido"
                iconDescription="none"
                onChange={(event) => setDocumentNumber(event.target.value)}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="fullName"
                labelText="Nombre completo"
                invalid={invalidFullName}
                invalidText="Valor inválido"
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="phone"
                labelText="Número de celular"
                invalid={invalidPhone}
                invalidText="Valor inválido"
                onChange={(event) => setPhone(event.target.value)}
                iconDescription="none"
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="address"
                labelText="Dirección"
                invalid={invalidAddress}
                invalidText="Valor inválido"
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>

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

            <div style={{ marginBottom: "1rem" }}>
              <PasswordInput
                id="confirmPassword"
                labelText="Confirmar contraseña"
                invalid={invalidConfirmPassword}
                invalidText="Valor inválido"
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            {registerError && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="error"
                  iconDescription="close button"
                  subtitle={<span>{registerError}</span>}
                  title="Uups!"
                  onClose={() => setRegisterError(undefined)}
                />
              </div>
            )}

            {registerMessage && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="success"
                  iconDescription="close button"
                  subtitle={<span>{registerMessage}</span>}
                  title="Cool!"
                  onClose={() => setRegisterMessage(undefined)}
                />
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={registerLoading}
              >
                Registrate
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
