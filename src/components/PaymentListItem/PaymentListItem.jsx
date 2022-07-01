import React from "react";

import { formatCurrency, formatDate } from "../../utils";

const LoanCard = ({ amount, at }) => {
  return (
    <div>
      <div className="cds--grid">
        <div className="cds--row">
          <div className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2">
            <p className="loan-details__payment_amount">
              {formatCurrency(amount * -1)}
            </p>
          </div>
          <div className="cds--col-lg-8 cds--col-md-4 cds--col-sm-2">
            <p className="loan-details__payment_date">{formatDate(at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
