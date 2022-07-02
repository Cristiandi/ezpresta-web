import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InlineLoading, InlineNotification, Pagination } from "@carbon/react";

import movementService from "../../../movement/movement.service";

import {
  delay,
  getMessageFromAxiosError,
  subtractDays,
  formatDate,
  formatCurrency,
} from "../../../../utils";

import BackButton from "../../../../components/BackButton";
import AppDataTable from "../../../../components/AppDataTable";

import { GlobalContext } from "../../../../App.jsx";

const headers = [
  {
    key: "at",
    header: "Fecha",
  },
  {
    key: "amount",
    header: "Monto",
  },
  {
    key: "movementTypeName",
    header: "Tipo de movimiento",
  },
];

const getRowItems = (rows) =>
  rows.map((row) => {
    let color;
    if (row?.movementType?.code === "04P") color = "green";
    if (row?.movementType?.code === "03IM") color = "red";

    const amountToRender = formatCurrency(
      row?.amount < 0 ? row?.amount * -1 : row?.amount
    );

    return {
      ...row,
      id: "" + row.id,
      at: formatDate(row.at),
      amount: <span style={{ color }}>{amountToRender}</span>,
    };
  });

const LoanMovements = () => {
  const [loanMovements, setLoanMovements] = useState([]);
  const [loanMovementsLoading, setLoanMovementsLoading] = useState(true);
  const [loanMovementsError, setLoanMovementsError] = useState("");

  const [firstRowIndex, setFirstRowIndex] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(10);

  const ctx = useContext(GlobalContext);
  const navigate = useNavigate();

  const { user } = ctx;

  const { uid } = useParams();

  const fetchLoanMovements = async (uid) => {
    setLoanMovementsLoading(true);

    try {
      const currentDate = new Date();
      const dateToGetLoanMovements = subtractDays(currentDate, 30);

      const [data] = await Promise.all([
        movementService.getLoanMovements({
          uid,
          startDate: dateToGetLoanMovements,
        }),
        delay(),
      ]);

      if (data.length > 0) {
        setLoanMovements(getRowItems(data));
      }
    } catch (error) {
      setLoanMovementsError(getMessageFromAxiosError(error));
    }

    setLoanMovementsLoading(false);
  };

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }

    fetchLoanMovements(uid);
  }, [navigate, uid, user]);

  return (
    <div className="cds--grid">
      <div className="cds--row">
        <div className="cds--offset-lg-5 cds--col-lg-6 cds--col-md-8 cds--col-sm-4">
          <BackButton />
          <h3 className="screen__heading">Movimientos</h3>
          {loanMovementsLoading && (
            <InlineLoading
              status="active"
              iconDescription="Active loading indicator"
              description="Cargando..."
              className={"center-screen"}
            />
          )}
          {loanMovementsError && (
            <div style={{ marginBottom: "1rem" }}>
              <InlineNotification
                kind="error"
                iconDescription="close button"
                subtitle={<span>{loanMovementsError}</span>}
                title="Uups!"
                onClose={() => setLoanMovementsError(undefined)}
              />
            </div>
          )}
          {!loanMovementsLoading && !loanMovementsError && loanMovements && (
            <div style={{ marginBottom: "1rem" }}>
              <AppDataTable
                title={"Lista"}
                description={"de los ultimos 30 días"}
                headers={headers}
                rows={loanMovements.slice(
                  firstRowIndex,
                  firstRowIndex + currentPageSize
                )}
              />
              <Pagination
                totalItems={loanMovements.length}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanMovements;
