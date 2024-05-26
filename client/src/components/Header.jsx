import { useEffect, useState } from "react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FiMenu } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { useSelector, useDispatch } from "react-redux";
import { reset, getRoles, logout } from "../features/auth/authSlice";
import {
  setSearchType,
  setFlexData,
  setAdvancedData,
  setLimit,
  setSort,
  setPage,
} from "../features/search/searchSlice";
import "./css/header.css";

function Header() {
  const loc = useLocation();

  const [searchData, setSearchData] = useState({
    search: "_",
    limit: 10,
    offset: 0,
    sort: "",
    title: "_",
    originalTitle: "_",
    authors: "_",
    genres: "_",
    section: "_",
    publisher: "_",
    yearStart: "_",
    yearEnd: "_",
    isbn: "_",
    udk: "_",
    bbk: "_",
  });

  const {
    search,
    title,
    originalTitle,
    authors,
    genres,
    section,
    publisher,
    yearStart,
    yearEnd,
    isbn,
    udk,
    bbk,
  } = searchData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, roles } = useSelector((state) => state.auth);
  const { books, isError, message } = useSelector((state) => state.books);

  useEffect(() => {
    if (user && user.token !== "" && roles.length === 0) {
      dispatch(getRoles());
    }
    return () => {
      dispatch(reset());
    };
  }, [user, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const onChange = (e) => {
    setSearchData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFlexFind = () => {
    dispatch(setSearchType("flex"));
    dispatch(setPage(1));
    dispatch(setFlexData(search));

    let inputEl = document.getElementById("search");
    inputEl.value = "";

    if (loc.pathname.startsWith("/book")) {
      navigate("/");
    }
  };

  const advancedSearch = (e) => {
    e.preventDefault();

    const advancedSearchData = {
      title,
      originalTitle,
      authors,
      genres,
      section,
      publisher,
      yearStart,
      yearEnd,
      isbn,
      udk,
      bbk,
    };
    dispatch(setSearchType("advanced"));
    dispatch(setPage(1));
    dispatch(setAdvancedData(advancedSearchData));
    navigate("/");

    let inputEl = document.getElementsByTagName("input");
    for (let el of inputEl) {
      el.value = "";
    }
    setSearchData((previousState) => ({
      title: "_",
      originalTitle: "_",
      authors: "_",
      genres: "_",
      section: "_",
      publisher: "_",
      yearStart: "_",
      yearEnd: "_",
      isbn: "_",
      udk: "_",
      bbk: "_",
    }));
  };

  return (
    <header>
      <div className="navigation">
        <div className="drop-menu">
          <IconContext.Provider value={{ color: "#e8f92e", size: "1.5em" }}>
            <FiMenu className="search-menu" />
          </IconContext.Provider>
          <div className="advanced-search-box">
            <h4>Advanced search</h4>
            <input
              type="text"
              name="title"
              placeholder="Title..."
              onChange={onChange}
            />
            <input
              type="text"
              name="originalTitle"
              placeholder="Original title..."
              onChange={onChange}
            />
            <input
              type="text"
              name="publisher"
              placeholder="Publisher..."
              onChange={onChange}
            />
            <input
              type="text"
              name="authors"
              placeholder="Authors..."
              onChange={onChange}
            />
            <input
              type="text"
              name="yearStart"
              placeholder="Year start..."
              onChange={onChange}
            />
            <input
              type="text"
              name="yearEnd"
              placeholder="Year end..."
              onChange={onChange}
            />
            <input
              type="text"
              name="genres"
              placeholder="Genres..."
              onChange={onChange}
            />
            <input
              type="text"
              name="section"
              placeholder="Section..."
              onChange={onChange}
            />
            <input
              type="text"
              name="udk"
              placeholder="UDK..."
              onChange={onChange}
            />
            <input
              type="text"
              name="bbk"
              placeholder="BBK..."
              onChange={onChange}
            />
            <input
              type="text"
              name="isbn"
              placeholder="ISBN..."
              onChange={onChange}
            />
            <input
              type="submit"
              name="button"
              value="Search"
              onClick={advancedSearch}
            />
          </div>
        </div>
        <input
          id="search"
          name="search"
          type="search"
          placeholder="Search..."
          onChange={onChange}
        />
        <IconContext.Provider value={{ color: "#e8f92e", size: "1.5em" }}>
          <HiMagnifyingGlass onClick={onFlexFind} />
        </IconContext.Provider>
        <select
          name="limit"
          id="limit"
          onChange={(e) => dispatch(setLimit(e.target.value))}
        >
          <option value={10}>limit</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
        <select
          name="sort"
          id="sort"
          onChange={(e) => dispatch(setSort(e.target.value))}
        >
          <option value={"createdAtDESC"}>sort option</option>
          <option value={"createdAtDESC"}>created ⬇</option>
          <option value={"createdAtASC"}>created ⬆</option>
          <option value={"titleDESC"}>title ⬇</option>
          <option value={"titleASC"}>title ⬆</option>
          <option value={"yearDESC"}>year ⬇</option>
          <option value={"yearASC"}>year ⬆</option>
          {/* <option value={"authorDESC"}>author ⬇</option>
          <option value={"authorASC"}>author ⬆</option>
          <option value={"genreDESC"}>genre ⬇</option>
          <option value={"genreASC"}>genre ⬆</option>
          <option value={"publisherDESC"}>publisher ⬇</option>
          <option value={"publisherASC"}>publisher ⬆</option> */}
          <option value={"rateDESC"}>rate ⬇</option>
          <option value={"rateASC"}>rate ⬆</option>
        </select>
      </div>
      <div className="center">
        <Link id="react-link" to="/">
          <div
            className="logo"
            onClick={() => {
              dispatch(setSearchType("latest"));
              dispatch(setPage(1));
            }}
          >
            EShelf
          </div>
        </Link>
      </div>
      <div className="auth">
        {user && user.token !== "" ? (
          <>
            <IconContext.Provider value={{ color: "#e8f92e", size: "1em" }}>
              <FaSignOutAlt />
            </IconContext.Provider>
            <Link id="react-link" to="/login">
              <h4 onClick={onLogout}>LogOut</h4>
            </Link>
            <Link to="/me">
              <h4>({user.email})</h4>
            </Link>
            {user && roles.includes("admin") ? (
              <div className="admin-drop-menu">
                <IconContext.Provider
                  value={{ color: "#ff0000", size: "1.5em" }}
                >
                  <FiMenu className="admin-panel" />
                </IconContext.Provider>
                <div className="admin-panel-box">
                  <h4>Admin panel</h4>
                  <input
                    type="submit"
                    name="button"
                    value="Add new Book"
                    onClick={() => {
                      navigate("/newbook");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Debts"
                    onClick={() => {
                      navigate("/debtlist");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Reservings"
                    onClick={() => {
                      navigate("/reservelist");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Headings"
                    onClick={() => {
                      navigate("/headings");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Verify list"
                    onClick={() => {
                      navigate("/verifylist");
                    }}
                  />
                  {roles.includes("main") && (
                    <input
                      type="submit"
                      name="button"
                      value="Set new admin"
                      onClick={() => {
                        navigate("/setadmin");
                      }}
                    />
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <IconContext.Provider value={{ color: "#e8f92e", size: "1em" }}>
              <FaSignInAlt />
            </IconContext.Provider>
            <Link id="react-link" to="/login">
              <h4>Login</h4>
            </Link>
            <IconContext.Provider value={{ color: "#e8f92e", size: "1em" }}>
              <FaUser />
            </IconContext.Provider>
            <Link id="react-link" to="/register">
              <h4>Register</h4>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
