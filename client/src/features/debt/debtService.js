import axios from "axios";

const URL_D = "/api/debt/";
const URL_R = "/api/reserve/";
const URL_S = "/api/bookmark/";

const getAllDebts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL_D, config);
  return res.data;
};

const getAllBookings = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL_R + "book", config);
  return res.data;
};

const oneBookDebt = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL + `onebook/${query}`, config);
  return res.data;
};

const bookTheBook = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(URL + `book/${query}`, {}, config);
  return res.data;
};

const unbookTheBook = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(URL + `delbook/${query}`, config);
  return res.data;
};

const getDebtsAuth = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL_D + `auth`, config);
  return res.data;
};

const getReservingsAuth = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL_D + `auth`, config);
  return res.data;
};

const getBookmarksAuth = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL_D + `auth`, config);
  return res.data;
};

const debtTheBook = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(
    URL + `?userq=${query.usr}&bookq=${query.bok}`,
    {},
    config
  );
  return res.data;
};

const deleteBookingAdm = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(
    URL + `book?userq=${query.usr}&bookq=${query.bok}`,
    config
  );
  return res.data;
};

const deleteUserDebt = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(
    URL + `?userq=${query.usr}&bookq=${query.bok}`,
    config
  );
  return res.data;
};

const debtService = {
  getAllDebts,
  oneBookDebt,
  bookTheBook,
  unbookTheBook,
  getDebtsAuth,
  getReservingsAuth,
  getBookmarksAuth,
  getAllBookings,
  debtTheBook,
  deleteBookingAdm,
  deleteUserDebt,
};

export default debtService;
