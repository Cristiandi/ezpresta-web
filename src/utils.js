import { getAuth } from "firebase/auth";

import firebaseApp from "./firebase";

export const setFirebaseProviderId = (value = "") => {
  localStorage.setItem("firebaseProviderId", value);
};

export const getFirebaseProviderId = () => {
  const providerId = localStorage.getItem("firebaseProviderId");

  return providerId || "none";
};

export const getIdTokenFromCurrentUser = async () => {
  const auth = getAuth(firebaseApp);

  const { currentUser } = auth;

  if (!currentUser) {
    return undefined;
  }

  const token = await currentUser.getIdToken();

  return token;
};

export const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// function to capitalize first letter of string
export const capitalizeFirstLetter = (value = "") => {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// function to format currency
export const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(value);
}

// function to format date
export const formatDate = (value = "") => {
  const parsedDate = new Date(value);

  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsedDate);
}

// function to format date time
export const formatDateTime = (value = "") => {
  const parsedDate = new Date(value);

  return parsedDate.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export const getMessageFromAxiosError = (error) => {
  if (error.response) {

    const { data } = error.response;

    if (data && data.message) {
      return data.message;
    }
  }

  return "Something went wrong";
}

export const addDays = (date = new Date(), days = 0) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date = new Date(), days = 0) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};
