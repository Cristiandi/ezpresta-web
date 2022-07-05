import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, InlineNotification, Button } from "@carbon/react";

import userService from "../../../user/user.service.js";

import { getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const ChangePhone = () => {
  const [phone, setPhone] = useState("");
  const [invalidPhone, setInvalidPhone] = useState(false);

  const [changePhoneLoading, setChangePhoneLoading] = useState(false);
  const [changePhoneError, setChangePhoneError] = useState("");
  const [changePhoneMessage, setChangePhoneMessage] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user]);

  const handleChangePhoneSubmit = async (event) => {
    event.preventDefault();

    if (!phone || phone.trim().length === 0) {
      setInvalidPhone(true);
      return;
    }
    // check if phone is a number
    if (isNaN(parseInt(phone, 10))) {
      setInvalidPhone(true);
      return;
    }

    setInvalidPhone(false);

    setChangePhoneLoading(true);

    try {
      const { message } = await userService.changePhone({
        authUid: user.uid,
        phone,
      });

      setChangePhoneMessage(message);
    } catch (error) {
      setChangePhoneError(getMessageFromAxiosError(error));
    }

    setChangePhoneLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton useMarginTop={false} useMarginButtom={false} />
          <h3 className="screen__heading">Cambiar télefono</h3>
          <Form onSubmit={handleChangePhoneSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="phone"
                labelText="Télefono"
                invalid={invalidPhone}
                invalidText="Valor inválido"
                iconDescription="none"
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
            {changePhoneError && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="error"
                  iconDescription="close button"
                  subtitle={<span>{changePhoneError}</span>}
                  title="Uups!"
                  onClose={() => setChangePhoneError(undefined)}
                />
              </div>
            )}
            {changePhoneMessage && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="success"
                  iconDescription="close button"
                  subtitle={<span>{changePhoneMessage}</span>}
                  title="Cool!"
                  onClose={() => setChangePhoneMessage(undefined)}
                />
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={changePhoneLoading}
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

export default ChangePhone;
