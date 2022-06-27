import axios from "axios";

import environment from "../../environment";

import {
  getIdTokenFromCurrentUser,
  formatCurrency,
  formatDate,
} from "../../utils";

class MovementService {
  async getLoanPayments({ uid, limit = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}movements/loan/${uid}/payments`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      params: {
        limit: limit,
      },
    });

    return [...data];
  }

  async getLoanMovements({ uid, limit = undefined, startDate = undefined, endDate = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}movements/loan/${uid}/movements`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      params: {
        limit,
        startDate,
        endDate,
      },
    });

    return [...data].map(item => {
      return {
        ...item,
        id: item.id + "",
        amount: formatCurrency(item.amount < 0 ? item.amount * -1 : item.amount),
        at: formatDate(item.at),
        movementTypeName: item?.movementType?.name || "none",
      };
    });
  }
}

const movementService = new MovementService();

export default movementService;
