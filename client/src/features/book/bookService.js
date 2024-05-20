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
  if (query.query === "") {
    query.query = "_";
  }
  const res = await axios.get(
    URL +
      `flex?query=${query.query}&limit=${query.limit}&offset=${query.offset}&sort=${query.sort}`
  );
  return res.data;
};

const advancedFind = async (query) => {
  const b = query.body;
  const q = query.query;
  for (let el in b) {
    if (b[el] === "") b[el] = "_";
  }
  const longquery = `advanced?limit=${q.limit}&offset=${q.offset}&sort=${q.sort}&title=${b.title}&authors=${b.authors}&genres=${b.genres}&section=${b.section}&publisher=${b.publisher}&yearStart=${b.yearStart}&yearEnd=${b.yearEnd}&isbn=${b.isbn}&udk=${b.udk}&bbk=${b.bbk}`;
  const res = await axios.get(URL + longquery);
  return res.data;
};

const oneBook = async (query) => {
  const res = await axios.get(URL + `one/${query}`);
  return res.data;
};

const getByHeading = async (query) => {
  const res = await axios.get(
    URL +
      `heading/${query.heading}?uuid=${query.uuid}&limit=${query.limit}&offset=${query.offset}&sort=${query.sort}`
  );
  return res.data;
};

const similarBooks = async (query) => {
  const res = await axios.get(URL + `similar?uuid=${query}`);
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
  getByHeading,
  similarBooks,
  deleteBook,
  createBook,
  incBookNum,
  decBookNum,
};

export default bookService;
