import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, TextInput, InlineNotification, Button } from "@carbon/react";

import userService from "../../../user/user.service.js";

import { getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const ChangeAddress = () => {
  const [address, setAddress] = useState("");
  const [invalidAddress, setInvalidAddress] = useState(false);

  const [changeAddressLoading, setChangeAddressLoading] = useState(false);
  const [changeAddressError, setChangeAddressError] = useState("");
  const [changeAddressMessage, setChangeAddressMessage] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user]);

  const handleChangeAddressSubmit = async (event) => {
    event.preventDefault();

    if (!address || address.trim().length === 0) {
      setInvalidAddress(true);
      return;
    }
    setInvalidAddress(false);

    setChangeAddressLoading(true);

    try {
      const { message } = await userService.changeAddress({
        authUid: user.uid,
        address,
      });

      setChangeAddressMessage(message);
    } catch (error) {
      setChangeAddressError(getMessageFromAxiosError(error));
    }

    setChangeAddressLoading(false);
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton useMarginTop={false} useMarginButtom={false} />
          <h3 className="screen__heading">Cambiar dirección</h3>
          <Form onSubmit={handleChangeAddressSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <TextInput
                id="address"
                labelText="Dirección"
                invalid={invalidAddress}
                invalidText="Valor inválido"
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            {changeAddressError && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="error"
                  iconDescription="close button"
                  subtitle={<span>{changeAddressError}</span>}
                  title="Uups!"
                  onClose={() => setChangeAddressError(undefined)}
                />
              </div>
            )}
            {changeAddressMessage && (
              <div style={{ marginBottom: "1rem" }}>
                <InlineNotification
                  kind="success"
                  iconDescription="close button"
                  subtitle={<span>{changeAddressMessage}</span>}
                  title="Cool!"
                  onClose={() => setChangeAddressMessage(undefined)}
                />
              </div>
            )}

            <div style={{ marginBottom: "1rem" }}>
              <Button
                className="btn-block"
                type="submit"
                size="sm"
                disabled={changeAddressLoading}
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

export default ChangeAddress;
