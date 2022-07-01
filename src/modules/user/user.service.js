import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class UserService {
  async createBorrower({
    documentNumber,
    fullName,
    email,
    phone,
    address,
    password,
  }) {
    const { data } = await axios({
      url: `${environment.API_URL}users/borrower`,
      method: "POST",
      data: {
        documentNumber,
        fullName,
        email,
        phone,
        address,
        password,
      },
    });

    return {
      ...data,
      message: "Tú cuenta ha sido creada con éxito",
    };
  }

  async getOne({ authUid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}users/${authUid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
    };
  }

  async changeEmail({ authUid, email }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}users/email`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        authUid,
        email,
      },
    });

    return {
      ...data,
      message: "Tú correo electrónico ha sido cambiado con éxito",
    };
  }

  async changePhone({ authUid, phone }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}users/phone`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        authUid,
        phone,
      },
    });

    return {
      ...data,
      message: "Tú número de teléfono ha sido cambiado con éxito",
    };
  }

  async changeAddress({ authUid, address }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}users/address`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        authUid,
        address,
      },
    });

    return {
      ...data,
      message: "Tú dirección ha sido cambiada con éxito",
    };
  }

  async changePassword({ authUid, oldPassword, newPassword }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}users/${authUid}/password`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        oldPassword,
        newPassword,
      },
    });

    return {
      ...data,
      message: "Tú contraseña ha sido cambiada con éxito",
    };
  }
}

const userService = new UserService();

export default userService;
