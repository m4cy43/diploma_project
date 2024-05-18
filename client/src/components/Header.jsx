import { useEffect, useState } from "react";
import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { IconContext } from "react-icons";
import { useSelector, useDispatch } from "react-redux";
import { reset, logout } from "../features/auth/authSlice";
import {
  simpleFind,
  advancedFind,
  resetBooks,
} from "../features/book/bookSlice";
import { setLimit, getRoles } from "../features/other/otherSlice";
import "./css/header.css";

function Header() {
  const [searchData, setSearchData] = useState({
    flex: "_",
    limit: 10,
    offset: 0,
    sort: "",
    title: "_",
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
    flex,
    title,
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
  const { user } = useSelector((state) => state.auth);
  const { books, isError, message } = useSelector((state) => state.books);
  const { roles, limit, sort } = useSelector((state) => state.other);

  useEffect(() => {
    if (user && roles.lenght === 0) {
      dispatch(getRoles());
    }
  }, [user, roles, dispatch]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/");
  };

  const onFlexFind = () => {
    if (isError) {
      console.log(message);
    }

    // if (!user) {
    //   navigate("/login");
    // }

    dispatch(simpleFind(flex));

    let inputEl = document.getElementById("search");
    inputEl.value = "";

    return () => {
      dispatch(resetBooks());
    };
  };

  const onChange = (e) => {
    setSearchData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const advancedSearch = (e) => {
    e.preventDefault();

    const advancedSearchData = {
      title,
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
    dispatch(advancedFind(advancedSearchData));

    let inputEl = document.getElementsByTagName("input");
    for (let el of inputEl) {
      el.value = "";
    }

    setSearchData((previousState) => ({
      title: "_",
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

    return () => {
      dispatch(resetBooks());
    };
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
              name="author"
              placeholder="Author surname..."
              onChange={onChange}
            />
            <input
              type="text"
              name="year"
              placeholder="Year..."
              onChange={onChange}
            />
            <input
              type="text"
              name="genre"
              placeholder="Genre..."
              onChange={onChange}
            />
            <input
              type="text"
              name="section"
              placeholder="Section..."
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
          type="text"
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
      </div>
      <div className="center">
        <Link id="react-link" to="/">
          <div className="logo">EShelf</div>
        </Link>
      </div>
      <div className="auth">
        {user && user.uuid !== "" ? (
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
            {user.roles && user.roles.includes("admin") ? (
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
                    value="Verify list"
                    onClick={() => {
                      navigate("/verifylist");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Booking list"
                    onClick={() => {
                      navigate("/bookinglist");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Debt list"
                    onClick={() => {
                      navigate("/debtlist");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Set new admin"
                    onClick={() => {
                      navigate("/setadmin");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Authors"
                    onClick={() => {
                      navigate("/authorslist");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Genres"
                    onClick={() => {
                      navigate("/genreslist");
                    }}
                  />
                  <input
                    type="submit"
                    name="button"
                    value="Sections"
                    onClick={() => {
                      navigate("/sectionslist");
                    }}
                  />
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
