import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  InlineLoading,
  InlineNotification,
  Pagination,
  Button,
  IconButton,
} from "@carbon/react";
import { View } from "@carbon/icons-react";

import loanRequestService from "../../loan-request.service";

import {
  delay,
  getMessageFromAxiosError,
  formatCurrency,
  formatDate,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "createdAt",
    header: "Fecha",
  },
  {
    key: "amount",
    header: "Monto",
  },
  {
    key: "status",
    header: "Estado",
  },
  {
    key: "actions",
    header: "Acciones",
  },
];

const LoanRequests = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loanRequestsLoading, setLoanRequestsLoading] = useState(true);
  const [loanRequestsError, setLoanRequestsError] = useState("");

  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const getRowItems = (rows) =>
    rows.map((row) => {
      let color;
      if (row?.status === "CREADA") color = "yellow";
      if (row?.status === "REVISION") color = "orange";
      if (row?.status === "RECHAZADA") color = "red";
      if (row?.status === "APROBADA") color = "green";

      const amountToRender = formatCurrency(row?.amount);

      return {
        ...row,
        id: "" + row.id,
        createdAt: formatDate(row.createdAt),
        amount: amountToRender,
        status: <span style={{ color }}>{row.status}</span>,
        actions: (
          <IconButton
            kind="ghost"
            size="sm"
            label="Ver solicitud"
            iconDescription="Ver solicitud"
            renderIcon={View}
            onClick={() => navigate(`/loan-requests/${row.uid}`)}
          />
        ),
      };
    });

  const fetchLoanRequests = async (userAuthUid) => {
    setLoanRequestsLoading(true);

    try {
      const [data] = await Promise.all([
        loanRequestService.getUserLoanRequests({
          userAuthUid,
        }),
        delay(),
      ]);

      if (data.length > 0) {
        setLoanRequests(getRowItems(data));
      }
    } catch (error) {
      setLoanRequestsError(getMessageFromAxiosError(error));
    }

    setLoanRequestsLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoanRequests(user.uid);
  }, [navigate, user]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Solicitudes</h3>
          {loanRequestsLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loanRequestsError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanRequestsError}</span>}
                title="Uups!"
                onClose={() => setLoanRequestsError(undefined)}
              />
            </div>
          )}
          {!loanRequestsLoading && !loanRequestsError && loanRequests && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  kind="ghost"
                  size="sm"
                  label="Crear solicitud"
                  iconDescription="Crear solicitud"
                  onClick={() => navigate("/loan-requests/create")}
                >
                  Crear solicitud
                </Button>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <AppDataTable
                  title={"Lista"}
                  description={"de tús solicitudes de prestamo"}
                  headers={headers}
                  rows={loanRequests.slice(
                    firstRowIndex,
                    firstRowIndex + currentPageSize
                  )}
                />
                <Pagination
                  totalItems={loanRequests.length}
                  backwardText="Anterior"
                  forwardText="Siguiente"
                  pageSize={currentPageSize}
                  pageSizes={[5, 10, 15, 25]}
                  itemsPerPageText=""
                  onChange={({ page, pageSize }) => {
                    if (pageSize !== currentPageSize) {
                      setCurrentPageSize(pageSize);
                    }
                    setFirstRowIndex(pageSize * (page - 1));
                  }}
                  size="sm"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanRequests;
