import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteBook,
  oneBook,
  resetBooks,
  getSimilar,
} from "../features/book/bookSlice";
import Spinner from "../components/Spinner";
import "./css/book.css";
import {
  resetDebts,
  isReserved,
  isDebted,
  isBookmarked,
  saveBook,
  deleteBookmark,
  reserveBook,
  debtBook,
  deleteReserving,
} from "../features/debt/debtSlice";
import {
  setPage,
  setSearchType,
  setHeadingData,
  setHeadingType,
} from "../features/search/searchSlice";
import TableLine from "../components/TableLine";
import { getByRoleAndMembership, resetUsers } from "../features/user/userSlice";
import Select from "react-select";
import "./css/tables.css";
import { toast } from "react-toastify";

function Book() {
  const { uuid } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, roles } = useSelector((state) => state.auth);
  const { book, recommended, isLoading, similarLoading, isError, message } =
    useSelector((state) => state.books);
  const debtsState = useSelector((state) => state.debts);
  const { debts, reservings, bookmarks } = debtsState;

  const { users } = useSelector((state) => state.user);

  const [debtedFlag, setDebtedFlag] = useState(false);
  const [reservedFlag, setReservedFlag] = useState(false);
  const [bookmarkedFlag, setBookmarkedFlag] = useState(false);

  const [reserveUuid, setReserveUuid] = useState("");
  const [bookmarkUuid, setBookmarkUuid] = useState("");

  const [reloadDebts, setReloadDebts] = useState(0);

  const [newDebt, setNewDebt] = useState("");
  const [deadline, setDeadline] = useState(14);
  const [formReaload, setFormReload] = useState(0);

  const [note, setNote] = useState("");

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(oneBook(uuid));

    return () => {
      dispatch(resetBooks());
    };
  }, [uuid, formReaload, isError, message, dispatch]);

  useEffect(() => {
    if (user && user.token !== "") {
      if (debtsState.isError) {
        console.log(debtsState.message);
      }

      dispatch(isDebted(uuid));
      dispatch(isReserved(uuid));
      dispatch(isBookmarked(uuid));
    }

    return () => {
      dispatch(resetDebts());
    };
  }, [user, reloadDebts]);

  useEffect(() => {
    if (debtsState.isError) {
      toast.error(debtsState.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    return () => {
      dispatch(resetDebts());
    };
  }, [debtsState.isError]);

  useEffect(() => {
    if (
      book.uuid !== "" &&
      debts.length > 0 &&
      debts[0].books[0].uuid === book.uuid
    ) {
      setDebtedFlag(true);
    }
  }, [debts, book]);

  useEffect(() => {
    if (
      book.uuid !== "" &&
      reservings.length > 0 &&
      reservings[0].books[0].uuid === book.uuid
    ) {
      setReservedFlag(true);
      setReserveUuid(reservings[0].books[0].userbook.uuid);
    } else {
      setReservedFlag(false);
    }
  }, [reservings, bookmarks, book]);

  useEffect(() => {
    if (
      book.uuid !== "" &&
      bookmarks.length > 0 &&
      bookmarks[0].books[0].uuid === book.uuid
    ) {
      setBookmarkedFlag(true);
      setBookmarkUuid(bookmarks[0].books[0].userbook.uuid);
    } else {
      setBookmarkedFlag(false);
    }
  }, [bookmarks, reservings, book]);

  if (isLoading) {
    return <Spinner />;
  }

  const delTheBook = async () => {
    if (window.confirm("Do you really want to delete this book?")) {
      await dispatch(deleteBook(uuid));
      navigate("/");
    }
  };

  const editTheBook = () => {
    navigate(`/editbook/${uuid}`);
  };

  const addBookmark = async () => {
    await dispatch(saveBook({ uuid, note }));
    document.getElementsByClassName("book-input-text")[0].value = "";
    setNote("");
    setReloadDebts(reloadDebts + 1);
    setBookmarkedFlag(true);
  };

  const removeBookmark = async () => {
    await dispatch(deleteBookmark(bookmarkUuid));
    setReloadDebts(reloadDebts + 1);
    setBookmarkedFlag(false);
  };

  const addReserve = async () => {
    await dispatch(reserveBook({ uuid, note }));
    document.getElementsByClassName("book-input-text")[0].value = "";
    setNote("");
    setReloadDebts(reloadDebts + 1);
    setReservedFlag(true);
    setFormReload(formReaload + 1);
  };

  const removeReserve = async () => {
    await dispatch(deleteReserving(reserveUuid));
    setReloadDebts(reloadDebts + 1);
    setReservedFlag(false);
    setFormReload(formReaload + 1);
  };

  const loadSimilar = () => {
    dispatch(getSimilar(uuid));
  };

  const headingFinder = (uuid, type) => {
    dispatch(setPage(1));
    dispatch(setSearchType("heading"));
    dispatch(setHeadingType(type));
    dispatch(setHeadingData(uuid));
  };

  let membershipOptions = users.map((el) => {
    return {
      value: el.uuid,
      label: el.membership,
    };
  });

  return (
    <>
      <main>
        <div className="book-box">
          <div className="add-info">
            {book.section ? (
              <h5>Section: {book.section.section}</h5>
            ) : (
              <h5>Section: --</h5>
            )}
            {user.token !== "" && roles.includes("admin") ? (
              <h5>
                Number: {book.number} Debted : {book.debtedNumber}
              </h5>
            ) : (
              <h5>Number: {book.number}</h5>
            )}
          </div>
          <div className="book-info">
            <h6>
              <span>Title:</span> {book.title}
            </h6>
            <h6>
              <span>Original title:</span> {book.originalTitle}
            </h6>
            <h6>
              <span>Publisher:</span>{" "}
              {book.publisher ? (
                <Link
                  to={`../`}
                  key={book.publisher.uuid}
                  onClick={() =>
                    headingFinder(book.publisher.uuid, "publisher")
                  }
                >
                  {book.publisher.publisher}
                </Link>
              ) : (
                "--"
              )}
            </h6>
            <h6>
              <span>Rate:</span> {book.rate}
            </h6>
            <h6>
              <span>Authors: </span>
              {book.authors.map((el) => {
                return (
                  <Link
                    to={`../`}
                    key={el.uuid}
                    onClick={() => headingFinder(el.uuid, "author")}
                  >
                    {el.name} {el.middlename} {el.surname}
                  </Link>
                );
              })}
            </h6>
            <h6>
              <span>Year of publish:</span> {book.yearPublish}
            </h6>
            <h6>
              <span>Year by author:</span> {book.yearAuthor}
            </h6>
            <h6>
              <span>Genres:</span>{" "}
              {book.genres.map((el) => {
                return (
                  <Link
                    to={`../`}
                    key={el.uuid}
                    onClick={() => headingFinder(el.uuid, "genre")}
                  >
                    {el.genre}
                  </Link>
                );
              })}
            </h6>
            <h6>
              <span>Annotation:</span> {book.annotation}
            </h6>
            <h6>
              <span>Bibliography:</span> {book.bibliography}
            </h6>
            <h6>
              <span>Physical description:</span> {book.physicalDescription}
            </h6>
            <h6>
              <span>Note:</span> {book.note}
            </h6>
            <h6>
              <span>UDK:</span> {book.udk}
            </h6>
            <h6>
              <span>BBK:</span> {book.bbk}
            </h6>
            <h6>
              <span>ISBN:</span>{" "}
              {book.isbns.map((el) => {
                return <a key={el.uuid}>{el.isbn}</a>;
              })}
            </h6>
          </div>
          <div className="book-bottom-panel">
            {user && roles.includes("admin") ? (
              <div style={{ display: "flex" }}>
                <input
                  type="submit"
                  value="Delete the book"
                  onClick={delTheBook}
                />
                <input
                  type="submit"
                  value="Edit the book"
                  onClick={editTheBook}
                />
                {book.number !== 0 && (
                  <>
                    <input
                      type="submit"
                      value="Debt"
                      onClick={async () => {
                        await dispatch(
                          debtBook({
                            userUuid: newDebt,
                            bookUuid: book.uuid,
                            deadline: !(
                              deadline < -7 ||
                              deadline > 60 ||
                              deadline === ""
                            )
                              ? deadline
                              : 14,
                            note: note,
                          })
                        );
                        setFormReload(formReaload + 1);
                      }}
                    />
                    <Select
                      placeholder="Membership"
                      options={membershipOptions}
                      onChange={(data) => setNewDebt(data.value)}
                      maxLength={10}
                      onMenuOpen={() =>
                        dispatch(
                          getByRoleAndMembership({
                            query: "_",
                            role: "verified",
                            limit: 3000,
                            offset: 0,
                          })
                        )
                      }
                      onMenuClose={() => dispatch(resetUsers())}
                      id="react-select-container"
                      classNamePrefix="react-select"
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 2,
                        colors: {
                          ...theme.colors,
                          primary25: "#68b16f",
                          primary: "#d6d6d6",
                        },
                      })}
                    />
                    <input
                      type="number"
                      name="deadline"
                      maxLength={2}
                      max={60}
                      min={-7}
                      placeholder="deadline"
                      style={{
                        width: "50px",
                        margin: "10px 0px 10px 10px",
                        height: "30px",
                      }}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </>
                )}
              </div>
            ) : (
              <></>
            )}
            {user && user.token !== "" && !(reservedFlag || debtedFlag) ? (
              <input
                className="book-input-text"
                placeholder="Your notes are here..."
                onChange={(e) => setNote(e.target.value)}
                maxLength={90}
              />
            ) : (
              <></>
            )}
            {user && user.token !== "" ? ( // && roles.includes("verified")
              <>
                {reservedFlag ? (
                  <input
                    type="submit"
                    value="UnReserve"
                    onClick={removeReserve}
                  />
                ) : debtedFlag ? (
                  <input
                    type="submit"
                    value="Book is Debted"
                    onClick={() => navigate("/me")}
                  />
                ) : (
                  book.number !== 0 && (
                    <input type="submit" value="Reserve" onClick={addReserve} />
                  )
                )}
                {bookmarkedFlag ? (
                  <input
                    type="submit"
                    value="Remove Bookmark"
                    onClick={removeBookmark}
                  />
                ) : (
                  !(reservedFlag || debtedFlag) && (
                    <input
                      type="submit"
                      value="Add Bookmark"
                      onClick={addBookmark}
                    />
                  )
                )}
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="similar">
            {similarLoading ? (
              <Spinner />
            ) : (
              <p>
                *It may take 15-30 sec to generate. Please do not refresh the
                page, or it will load longer.
              </p>
            )}
            <button onClick={loadSimilar}>Get similar books</button>
            <table>
              <tbody>
                <tr>
                  <th>N</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>Genres</th>
                  <th>Publisher</th>
                  <th>Rate</th>
                </tr>
                {recommended ? (
                  recommended.map((book) => (
                    <TableLine book={book} key={book.uuid} />
                  ))
                ) : (
                  <TableLine
                    book={{
                      number: "",
                      title: "",
                      authors: [{ name: "", surname: "", middlename: "" }],
                      year: "",
                      genres: [{ genre: "" }],
                      publisher: { publisher: "" },
                      rate: "",
                    }}
                    key={""}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default Book;
