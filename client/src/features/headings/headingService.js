import axios from "axios";

const authorURL = "/api/headings/author";
const genreURL = "/api/headings/genre";
const sectionURL = "/api/headings/section";
const publisherURL = "/api/headings/publisher";
const isnbURL = "/api/headings/isbn";

const getAuthors = async (query) => {
  const res = await axios.get(
    authorURL +
      `?query=${query.query}&limit=${query.limit}&offset=${query.offset}`
  );
  return res.data;
};

const getGenres = async (query) => {
  const res = await axios.get(
    genreURL +
      `?query=${query.query}&limit=${query.limit}&offset=${query.offset}`
  );
  return res.data;
};

const getSections = async (query) => {
  const res = await axios.get(
    sectionURL +
      `?query=${query.query}&limit=${query.limit}&offset=${query.offset}`
  );
  return res.data;
};

const getPublishers = async (query) => {
  const res = await axios.get(
    publisherURL +
      `?query=${query.query}&limit=${query.limit}&offset=${query.offset}`
  );
  return res.data;
};

const getIsbns = async (query) => {
  const res = await axios.get(
    isnbURL +
      `?query=${query.query}&limit=${query.limit}&offset=${query.offset}`
  );
  return res.data;
};

const createAuthor = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(authorURL + "", data, config);
  return res.data;
};

const createGenre = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(genreURL + "", data, config);
  return res.data;
};

const createSection = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(sectionURL + "", data, config);
  return res.data;
};

const createPublisher = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(publisherURL + "", data, config);
  return res.data;
};

const createIsbn = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(isnbURL + "", data, config);
  return res.data;
};

const deleteAuthor = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(authorURL + `/${query}`, config);
  return res.data;
};

const deleteGenre = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(genreURL + `/${query}`, config);
  return res.data;
};

const deleteSection = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(sectionURL + `/${query}`, config);
  return res.data;
};

const deletePublisher = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(publisherURL + `/${query}`, config);
  return res.data;
};

const deleteIsbn = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(isnbURL + `/${query}`, config);
  return res.data;
};

const bookService = {
  getAuthors,
  getGenres,
  getSections,
  getPublishers,
  getIsbns,
  createAuthor,
  createGenre,
  createSection,
  createPublisher,
  createIsbn,
  deleteAuthor,
  deleteGenre,
  deleteSection,
  deletePublisher,
  deleteIsbn,
};

export default bookService;
