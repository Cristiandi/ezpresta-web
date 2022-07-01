import React, { useContext } from "react";
import {
  Header,
  HeaderContainer,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  SideNav,
  SideNavItems,
  HeaderSideNavItems,
} from "@carbon/react";
import {
  Notification,
  UserAvatar,
  Logout,
  Login,
  DataFormat,
} from "@carbon/icons-react";
import { Link } from "react-router-dom";

import authService from "../../modules/auth/auth.service";

import { GlobalContext } from "../../App.jsx";

const AppHeader = () => {
  const ctx = useContext(GlobalContext);

  const { user } = ctx;

  const handleLogoutClick = async (event) => {
    event.preventDefault();
    await authService.logout();
  };

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <Header aria-label="EZPresta">
          <SkipToContent />
          {user && (
            <HeaderMenuButton
              aria-label="Open menu"
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
          )}
          <HeaderName element={Link} to={user ? "/home" : "/"} prefix="EZ">
            Presta
          </HeaderName>

          {user && (
            <HeaderNavigation aria-label="EZPresta web">
              <HeaderMenu aria-label="Web links" menuLinkName="Links">
                <HeaderMenuItem element={Link} to="/help">
                  Ayuda
                </HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>
          )}

          {user && (
            <SideNav
              aria-label="Side navigation"
              expanded={isSideNavExpanded}
              isPersistent={false}
            >
              <SideNavItems>
                <HeaderSideNavItems>
                  <HeaderMenuItem element={Link} to="/help">
                    Ayuda
                  </HeaderMenuItem>
                </HeaderSideNavItems>
              </SideNavItems>
            </SideNav>
          )}

          {user && (
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Notificaciones"
                tooltipAlignment="center"
              >
                <Notification size={20} />
              </HeaderGlobalAction>
              <HeaderGlobalAction aria-label="Perfil" tooltipAlignment="center">
                <Link to="/user/profile">
                  <UserAvatar size={20} />
                </Link>
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Salir"
                tooltipAlignment="end"
                onClick={handleLogoutClick}
              >
                <Logout size={20} />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          )}

          {!user && (
            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Inicia sesión"
                tooltipAlignment="center"
              >
                <Link to="/login">
                  <Login size={20} />
                </Link>
              </HeaderGlobalAction>
              <HeaderGlobalAction
                aria-label="Registrate"
                tooltipAlignment="end"
              >
                <Link to="/register">
                  <DataFormat size={20} />
                </Link>
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          )}
        </Header>
      )}
    />
  );
};

export default AppHeader;
