import axios from "axios";

const URL = "/api/debt/";

const getAllDebts = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(
    URL +
      `all?query=${query.query}&limit=${query.limit}&offset=${query.offset}`,
    config
  );
  return res.data;
};

const getDebtsAuth = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL + `auth`, config);
  return res.data;
};

const debtBook = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL, data, config);
  return res.data;
};

const reserveToDebt = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL + `restodebt`, data, config);
  return res.data;
};

const deleteDebt = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(URL + `${query}`, config);
  return res.data;
};

const sendEmail = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(URL + `mail/${query}`, config);
  return res.data;
};

const debtService = {
  getAllDebts,
  getDebtsAuth,
  debtBook,
  reserveToDebt,
  deleteDebt,
  sendEmail,
};

export default debtService;
