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

const saveBook = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(URL + `${query}`, {}, config);
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
  saveBook,
  deleteBookmark,
};

export default bookmarkService;
