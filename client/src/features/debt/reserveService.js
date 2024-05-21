import axios from "axios";

const URL = "/api/reserve/";

const getAllReservings = async (query, token) => {
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

const getReservingsAuth = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL + `auth`, config);
  return res.data;
};

const reserveBook = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(URL + `${query}`, {}, config);
  return res.data;
};

const deleteReserving = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(URL + `${query}`, config);
  return res.data;
};

const reserveService = {
  getAllReservings,
  getReservingsAuth,
  reserveBook,
  deleteReserving,
};

export default reserveService;
