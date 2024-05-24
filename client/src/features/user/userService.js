import axios from "axios";

const URL = "/api/user/";

const getByRoleAndMembership = async (query) => {
  const res = await axios.get(
    URL +
      `q?query=${query.query}&role=${query.role}&limit=${query.limit}&offset=${query.offset}`
  );
  return res.data;
};

const getByMembership = async (query) => {
  const res = await axios.get(
    URL +
      `member?query=${query.query}&limit=${query.limit}&offset=${query.offset}`
  );
  return res.data;
};

const verifyUser = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL + `verify/${query}`, {}, config);
  return res.data;
};

const updUser = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL + `${query}`, {}, config);
  return res.data;
};

const delUser = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(URL + `${query}`, config);
  return res.data;
};

const setAdmin = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL + `setadmin/${query}`, {}, config);
  return res.data;
};

const delAdmin = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL + `deladmin/${query}`, {}, config);
  return res.data;
};

const userService = {
  getByRoleAndMembership,
  getByMembership,
  verifyUser,
  updUser,
  delUser,
  setAdmin,
  delAdmin,
};

export default userService;
