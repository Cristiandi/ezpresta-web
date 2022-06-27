import axios from "axios";

import environment from "../../environment";

import {
  getIdTokenFromCurrentUser,
  addMinutes,
} from "../../utils";

class LoanService {
  async getUserLoans({ userAuthUid, limit = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/user-loans/${userAuthUid}`,
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

  async getLoanDetails({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/details/${uid}`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    return {
      ...data,
      loanPaymentDate: addMinutes(data.loanPaymentDate, 5 * 60),
    };
  }
}

const loanService = new LoanService();

export default loanService;
