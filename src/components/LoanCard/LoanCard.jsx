import React from "react";
import { Link } from "react-router-dom";
import { Tag } from "@carbon/react";

import { capitalizeFirstLetter, formatCurrency, formatDate } from "../../utils";

const LoanCard = ({
  uid,
  description,
  minimumLoanPaymentAmount,
  loanPaymentStatus,
  loanPaymentDate,
}) => {
  return (
    <div className="loan-card" style={{ marginBottom: "1rem" }}>
      <div className="cds--grid">
        <div className="cds--row">
          <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
            <h3 className="loan-card__heading">
              <Link to={`/loans/${uid}`}>
                {capitalizeFirstLetter(description)}
              </Link>
            </h3>
          </div>
          <div className="cds--col-lg-16 cds--col-md-8 cds--col-sm-4">
            <p className="loan-card__label">Pago mínimo</p>
            <h4>
              <strong>{formatCurrency(minimumLoanPaymentAmount)}</strong>
            </h4>
          </div>
          <div className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2">
            <p className="loan-card__label">Fecha de pago</p>
            <p className="loan-card__payment_date">
              {formatDate(loanPaymentDate)}
            </p>
          </div>
          <div
            className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2"
            style={{ position: "relative" }}
          >
            <Tag
              type={loanPaymentStatus === "al día" ? "green" : "red"}
              size="md"
              title="Loan status tag"
            >
              {capitalizeFirstLetter(loanPaymentStatus)}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
