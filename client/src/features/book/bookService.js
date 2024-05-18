import axios from "axios";

const URL = "/api/book/";

const getLatest = async (query) => {
  const res = await axios.get(
    URL +
      `latest?limit=${query.limit}&offset=${query.offset}&sort=${query.sort}`
  );
  return res.data;
};

const simpleFind = async (query) => {
  if (query === "") query = "_";
  const res = await axios.get(URL + `flex?title=${query}`);
  return res.data;
};

const advancedFind = async (query) => {
  for (let el in query) {
    if (query[el] === "") query[el] = "_";
  }
  const res = await axios.get(
    URL +
      `afind?title=${query.title}&author=${query.author}&year=${query.year}&genre=${query.genre}&section=${query.section}`
  );
  return res.data;
};

const oneBook = async (query) => {
  const res = await axios.get(URL + `one/${query}`);
  return res.data;
};

const getAuthorBooks = async (query) => {
  const res = await axios.get(URL + `authorall/${query}`);
  return res.data;
};

const deleteBook = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(URL + `one/${query}`, config);
  return res.data;
};

const createBook = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(URL, data, config);
  return res.data;
};

const incBookNum = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL + `inc/${query}`, {}, config);
  return res.data;
};

const decBookNum = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(URL + `dec/${query}`, {}, config);
  return res.data;
};

const bookService = {
  getLatest,
  simpleFind,
  advancedFind,
  oneBook,
  getAuthorBooks,
  deleteBook,
  createBook,
  incBookNum,
  decBookNum,
};

export default bookService;
