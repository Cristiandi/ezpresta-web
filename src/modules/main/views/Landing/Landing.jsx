import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
} from "@carbon/react";
import { Scales, PersonFavorite, Run } from "@carbon/icons-react";

import { InfoSection, InfoCard } from "../../../../components/Info";

import { GlobalContext } from "../../../../App.jsx";

const Landing = () => {
  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  useEffect(() => {
    if (user) {
      return navigate("/home");
    }
  }, [navigate, user]);

  return (
    <Grid className="landing-page" fullWidth>
      <Column lg={16} md={8} sm={4} className="landing-page__banner">
        <Breadcrumb noTrailingSlash aria-label="Page navigation">
          <BreadcrumbItem>
            <a href="/">Comienza aquí</a>
          </BreadcrumbItem>
        </Breadcrumb>
        <h1 className="landing-page__heading">
          Solicitas &amp; obtienes en EZPresta
        </h1>
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r2">
        <Tabs defaultSelectedIndex={0}>
          <TabList className="tabs-group" aria-label="Tab navigation">
            <Tab>Introducción</Tab>
            <Tab>Solicitas</Tab>
            <Tab>Obtienes</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  md={4}
                  lg={7}
                  sm={4}
                  className="landing-page__tab-content"
                >
                  <h2 className="landing-page__subheading">
                    ¿Que es EZPresta?
                  </h2>
                  <p className="landing-page__p">
                    EZPresta es una plataforma de prestamos que te permite
                    solicitar prestamos justos a través de una aplicación móvil,
                    de una manera rápida y sencilla.
                  </p>
                  <Button>Conoce más</Button>
                </Column>
                <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                  <img
                    className="landing-page__illo"
                    src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                    alt="Carbon illustration"
                  />
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  md={4}
                  lg={7}
                  sm={4}
                  className="landing-page__tab-content"
                >
                  <h2 className="landing-page__subheading">¿Solicitas?</h2>
                  <p className="landing-page__p">
                    Primero debes solicitar tu prestamo, lo cual se realiza de
                    una manera sencilla y solo necesitamos un minímo de
                    información.
                    <br />
                    Tú solicitud sera evaluada y te responderemos rapidamente.
                  </p>
                </Column>
                <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                  <img
                    className="landing-page__illo"
                    src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                    alt="Carbon illustration"
                  />
                </Column>
              </Grid>
            </TabPanel>
            <TabPanel>
              <Grid className="tabs-group-content">
                <Column
                  md={4}
                  lg={7}
                  sm={4}
                  className="landing-page__tab-content"
                >
                  <h2 className="landing-page__subheading">¿Obtienes?</h2>
                  <p className="landing-page__p">
                    Una vez tu solicitud sea aprobada, nos pondremos en contacto
                    contigo para coordinar la entrega de tu prestamo.
                  </p>
                </Column>
                <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                  <img
                    className="landing-page__illo"
                    src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                    alt="Carbon illustration"
                  />
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
      <Column lg={16} md={8} sm={4} className="landing-page__r3">
        <InfoSection heading="Los Principios">
          <InfoCard
            heading="EZPresta es Justa"
            body="No buscamos cobrar porcentajes excesivos por el servicio que prestamos, por el contrario, buscamos ser una ayuda para tí."
            icon={() => <Scales size={32} />}
          />
          <InfoCard
            heading="EZPresta es Sencilla"
            body="Creemos que las cosas sencillas son las que más valen, por eso trabajamos para que el proceso de solicitud del prestamo sea y se mantenga lo más sencillo posible."
            icon={() => <PersonFavorite size={32} />}
          />
          <InfoCard
            heading="EZPresta es Rápida"
            body="Sabemos que si realizaste un solicitud de un prestamo, es porque probablemente lo requieras con prontitud, es por eso que nos esforzamos por darle respuesta a tú solicitud lo más rápido posible."
            icon={() => <Run size={32} />}
          />
        </InfoSection>
      </Column>
    </Grid>
  );
};

export default Landing;
