import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser, addMinutes } from "../../utils";

class LoanService {
  async getUserLoans({ userAuthUid, limit = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/user-loans/${userAuthUid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: limit,
      },
    });

    return [...data];
  }

  async getLoanDetails({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/details/${uid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
      loanPaymentDate: addMinutes(data.loanPaymentDate, 5 * 60),
    };
  }

  async createEpaycoTransaction({ uid, amount }) {
    const token = await getIdTokenFromCurrentUser();

    // eslint-disable-next-line no-console
    console.log("amount", Math.ceil(amount));

    const { data } = await axios({
      url: `${environment.API_URL}epayco-transactions`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        loanUid: uid,
        amount: Math.ceil(amount),
      },
    });

    return data;
  }

  async getEpaycoTrasaction({ ePaycoRef }) {
    // eslint-disable-next-line no-console
    console.log(
      `https://secure.epayco.co/validation/v1/reference/${ePaycoRef}`
    );

    const { data } = await axios({
      url: `https://secure.epayco.co/validation/v1/reference/${ePaycoRef}`,
      method: "GET",
      headers: {},
    });

    return { ...data.data };
  }
}

const loanService = new LoanService();

export default loanService;
