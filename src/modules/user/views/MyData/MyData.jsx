import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InlineLoading, InlineNotification } from "@carbon/react";
import { Email, Phone, Location } from "@carbon/icons-react";

import userService from "../../../user/user.service";

import { delay, getMessageFromAxiosError } from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const MyData = () => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [userInfoLoading, setLoadingUserInfo] = useState(true);
  const [userInfoError, setUserInfoError] = useState("");

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const fetchUserInfo = async (user) => {
    setLoadingUserInfo(true);

    try {
      const [data] = await Promise.all([
        userService.getOne({ authUid: user.uid }),
        delay(),
      ]);

      setUserInfo(data);
    } catch (error) {
      setUserInfoError(getMessageFromAxiosError(error));
    }

    setLoadingUserInfo(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchUserInfo(user);
  }, [navigate, user]);

  const handleChangeEmailButtonClick = () => {
    return navigate("/user/change-email");
  };

  const handleChangePhoneButtonClick = () => {
    return navigate("/user/change-phone");
  };

  const handleChangeAddressButtonClick = () => {
    return navigate("/user/change-address");
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton useMarginTop={false} useMarginButtom={false} />
          <h3 className="screen__heading">Actualiza tús datos</h3>
          {userInfoLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {userInfoError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{userInfoError}</span>}
                title="Uups!"
                onClose={() => setUserInfoError(undefined)}
              />
            </div>
          )}
          {userInfo && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="tertiary"
                  size="sm"
                  label="Cambiar email"
                  iconDescription="Cambiar email"
                  className="profile__button"
                  renderIcon={Email}
                  onClick={handleChangeEmailButtonClick}
                >
                  {userInfo.email}
                </Button>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="tertiary"
                  size="sm"
                  label="Cambiar teléfono"
                  iconDescription="Cambiar teléfono"
                  className="profile__button"
                  renderIcon={Phone}
                  onClick={handleChangePhoneButtonClick}
                >
                  {userInfo.phone}
                </Button>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="tertiary"
                  size="sm"
                  label="Cambiar dirección"
                  iconDescription="Cambiar dirección"
                  className="profile__button"
                  renderIcon={Location}
                  onClick={handleChangeAddressButtonClick}
                >
                  {userInfo.address}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyData;
