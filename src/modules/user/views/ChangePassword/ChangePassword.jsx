import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, PasswordInput, InlineNotification, Button } from "@carbon/react";

import userService from "../../../user/user.service.js";

import { getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidConfirmPassword, setInvalidConfirmPassword] = useState(false);

  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(undefined);
  const [changePasswordMessage, setChangePasswordMessage] = useState(undefined);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user]);

  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!currentPassword || currentPassword.trim().length === 0) {
      setInvalidCurrentPassword(true);
      return;
    }
    setInvalidCurrentPassword(false);

    if (!newPassword || newPassword.trim().length === 0) {
      setInvalidNewPassword(true);
      return;
    }
    setInvalidNewPassword(false);

    if (!confirmPassword || confirmPassword.trim().length === 0) {
      setInvalidConfirmPassword(true);
      return;
    }
    setInvalidConfirmPassword(false);

    if (newPassword !== confirmPassword) {
      setInvalidConfirmPassword(true);
      return;
    }
    setInvalidConfirmPassword(false);

    setChangePasswordLoading(true);

    try {
      await userService.changePassword({
        authUid: user.uid,
        oldPassword: currentPassword,
        newPassword,
      });
      setChangePasswordMessage("Password changed successfully");
    } catch (error) {
      setChangePasswordError(getMessageFromAxiosError(error));
    }

    setChangePasswordLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Cambiar contraseña</h3>
          <Form onSubmit={handleChangePasswordSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <PasswordInput
                id="currentPassword"
                labelText="Contraseña actual"
                invalid={invalidCurrentPassword}
                invalidText="Valor inválido"
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <PasswordInput
                id="newPassword"
                labelText="Contraseña nueva"
                invalid={invalidNewPassword}
                invalidText="Valor inválido"
                onChange={(event) => setNewPassword(event.target.value)}
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
            {changePasswordError && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="error"
                  iconDescription="close button"
                  subtitle={<span>{changePasswordError}</span>}
                  title="Uups!"
                  onClose={() => setChangePasswordError(undefined)}
                />
              </div>
            )}
            {changePasswordMessage && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="success"
                  iconDescription="close button"
                  subtitle={<span>{changePasswordMessage}</span>}
                  title="Cool!"
                  onClose={() => setChangePasswordMessage(undefined)}
                />
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={changePasswordLoading}
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

export default ChangePassword;
