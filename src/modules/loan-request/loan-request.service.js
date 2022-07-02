import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class LoanRequestService {
  async getUserLoanRequests({ userAuthUid, limit = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loan-requests/user-loan-requests/${userAuthUid}`,
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

  async createLoanRequest({ userAuthUid, description, amount }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loan-requests`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userAuthUid,
        description,
        amount,
      },
    });

    return {
      ...data,
      message: "Tú solicitud de préstamo ha sido enviada",
    };
  }
}

const loanRequestService = new LoanRequestService();

export default loanRequestService;
