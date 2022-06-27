import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

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
}

const movementService = new MovementService();

export default movementService;
