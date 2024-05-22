import axios from "axios";

const URL = "/api/bookmark/";

const getBookmarksAuth = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL + `auth`, config);
  return res.data;
};

const isBookmarked = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(URL + `is/${query}`, config);
  return res.data;
};

const saveBook = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(
    URL + `?uuid=${query.uuid}&note=${query.note}`,
    {},
    config
  );
  return res.data;
};

const deleteBookmark = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.delete(URL + `${query}`, config);
  return res.data;
};

const bookmarkService = {
  getBookmarksAuth,
  isBookmarked,
  saveBook,
  deleteBookmark,
};

export default bookmarkService;
