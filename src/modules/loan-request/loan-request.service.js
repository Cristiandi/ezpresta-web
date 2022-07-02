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

  async getLoanRequest({ loanRequestUid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loan-requests/${loanRequestUid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
    };
  }

  async updateLoanRequest({ loanRequestUid, description, amount }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loan-requests/${loanRequestUid}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        description,
        amount,
      },
    });

    return {
      ...data,
      message: "Tú solicitud de préstamo ha sido actualizada",
    };
  }

  async deleteLoanRequest({ loanRequestUid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loan-requests/${loanRequestUid}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
      message: "Tú solicitud de préstamo ha sido eliminada",
    };
  }
}

const loanRequestService = new LoanRequestService();

export default loanRequestService;
