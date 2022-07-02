import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  InlineLoading,
  InlineNotification,
  IconButton,
} from "@carbon/react";
import {
  Identification,
  SecurityServices,
  Document,
  Camera,
} from "@carbon/icons-react";

import userService from "../../../user/user.service";

import {
  delay,
  getMessageFromAxiosError,
  capitalizeFirstLetter,
  formatDateTime,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";

import { GlobalContext } from "../../../../App.jsx";

const Profile = () => {
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

  const handleMyDataButtonClick = () => {
    return navigate("/user/my-data");
  };

  const handleSecurityButtonClick = () => {
    return navigate("/user/security");
  };

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
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
              <img
                className="profile__image"
                src={`${process.env.PUBLIC_URL}/default-profile-image.jpg`}
                alt="Avatar"
              />
              <div style={{ textAlign: "center" }}>
                <IconButton
                  kind="ghost"
                  size="sm"
                  label="Subir imagen"
                  iconDescription="Subir imagen"
                  renderIcon={Camera}
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <h3 className="profile__heading">
                  {capitalizeFirstLetter(userInfo.fullName)}
                </h3>
                <p className="profile__subheading">
                  Último ingreso:{" "}
                  {formatDateTime(user?.metadata?.lastSignInTime)}
                </p>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="tertiary"
                  size="sm"
                  label="Mis datos"
                  iconDescription="Mis datos"
                  className="profile__button"
                  renderIcon={Identification}
                  onClick={handleMyDataButtonClick}
                >
                  Mis datos
                </Button>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="tertiary"
                  size="sm"
                  label="Seguridad"
                  iconDescription="Seguridad"
                  className="profile__button"
                  renderIcon={SecurityServices}
                  onClick={handleSecurityButtonClick}
                >
                  Seguridad
                </Button>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="tertiary"
                  size="sm"
                  label="Seguridad"
                  iconDescription="Seguridad"
                  className="profile__button"
                  renderIcon={Document}
                >
                  Teminos y privacidad
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
