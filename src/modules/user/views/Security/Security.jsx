import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@carbon/react";
import { Password } from "@carbon/icons-react";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const Security = () => {
  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [navigate, user]);

  const handleChangePasswordButtonClick = () => {
    return navigate("/user/change-password");
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton useMarginTop={false} useMarginButtom={false} />
          <h3 className="screen__heading">Seguridad</h3>
          <div style={{ marginBottom: "1rem" }}>
            <Button
              kind="tertiary"
              size="sm"
              label="Cambiar contraseña"
              iconDescription="Cambiar contraseña"
              className="profile__button"
              renderIcon={Password}
              onClick={handleChangePasswordButtonClick}
            >
              &nbsp;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
