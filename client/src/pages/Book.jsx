import { useEffect } from "react";
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
  getDebtsAuth,
  getReservingsAuth,
  getBookmarksAuth,
  saveBook,
  deleteBookmark,
  reserveBook,
  deleteReserving,
} from "../features/debt/debtSlice";
import {
  setPage,
  setSearchType,
  setHeadingData,
  setHeadingType,
} from "../features/search/searchSlice";
import TableLine from "../components/TableLine";
import "./css/tables.css";

function Book() {
  const { uuid } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, roles } = useSelector((state) => state.auth);
  const {
    book,
    books,
    isLoading,
    similarLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.books);
  const debtsState = useSelector((state) => state.debts);
  const debts = debtsState.debts;
  const reservings = debtsState.reservings;
  const bookmarks = debtsState.bookmarks;

  let [isDebted, isReserved, isBookmarked] = [false, false, false];
  isDebted = debts[0].books.findIndex((x) => x.uuid === book.uuid) !== -1;
  isReserved =
    reservings[0].books.findIndex((x) => x.uuid === book.uuid) !== -1;
  isBookmarked =
    bookmarks[0].books.findIndex((x) => x.uuid === book.uuid) !== -1;

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(oneBook(uuid));

    if (user && user.token !== "") {
      if (debtsState.isError) {
        console.log(debtsState.message);
      }

      dispatch(getDebtsAuth(uuid));
      dispatch(getReservingsAuth(uuid));
      dispatch(getBookmarksAuth(uuid));
    }

    return () => {
      dispatch(resetDebts());
      dispatch(resetBooks());
    };
  }, [user, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const delTheBook = () => {
    dispatch(deleteBook(uuid));
    navigate("/");
  };

  const editTheBook = () => {
    // dispatch(deleteBook(uuid));
    // navigate("/");
  };

  const addBookmark = () => {
    dispatch(saveBook(uuid));
  };

  const removeBookmark = () => {
    dispatch(deleteBookmark(uuid));
  };

  const addReserve = () => {
    dispatch(reserveBook(uuid));
  };

  const removeReserve = () => {
    dispatch(deleteReserving(uuid));
  };

  // const unBook = () => {
  //   dispatch(unbookTheBook(uuid));
  //   return () => {
  //     dispatch(resetDebts());
  //   };
  // };

  // const incNum = () => {
  //   dispatch(incBookNum(uuid));
  // };

  // const decNum = () => {
  //   dispatch(decBookNum(uuid));
  // };

  const loadSimilar = () => {
    dispatch(getSimilar(uuid));
  };

  const headingFinder = (uuid, type) => {
    dispatch(setPage(1));
    dispatch(setSearchType("heading"));
    dispatch(setHeadingType(type));
    dispatch(setHeadingData(uuid));
  };

  return (
    <>
      <main>
        <div className="book-box">
          <div className="add-info">
            {user.roles && user.roles.includes("admin") ? (
              <div className="number-buttons">
                <h5>{book.number} books in stock</h5>
                {/* <input type="submit" value="+" onClick={incNum} />
                <input type="submit" value="-" onClick={decNum} /> */}
              </div>
            ) : (
              <></>
            )}
            <h5>Section: {book.section.section}</h5>
            <h5>Number: {book.number}</h5>
          </div>
          <div className="book-info">
            <h6>
              <span>Title:</span> {book.originalTitle}
            </h6>
            <h6>
              <span>Original title:</span> {book.originalTitle}
            </h6>
            <h6>
              <span>Publisher:</span>{" "}
              <Link
                to={`../`}
                key={book.publisher.uuid}
                onClick={() => headingFinder(book.publisher.uuid, "publisher")}
              >
                {book.publisher.publisher}
              </Link>
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
              <>
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
              </>
            ) : (
              <></>
            )}
            {/* {
              user && roles.includes("verified") ? (
              debts.user[0] ? (
                debts.user[0].books[0].debt.isBooked ? (
                  <input
                    type="submit"
                    value="The book is booked"
                    onClick={unBook}
                  />
                ) : (
                  <input type="submit" value="The book is debted" />
                )
              ) : (
                <input type="submit" value="Take the book" onClick={takeBook} />
              ))
            :{}} */}
            {user && roles.includes("verified") ? (
              <>
                {isBookmarked ? (
                  <input
                    type="submit"
                    value="Remove Bookmark"
                    onClick={removeBookmark}
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add Bookmark"
                    onClick={addBookmark}
                  />
                )}
                {isReserved ? (
                  <input
                    type="submit"
                    value="UnReserve"
                    onClick={removeReserve}
                  />
                ) : isDebted ? (
                  <input
                    type="submit"
                    value="Book is Debted"
                    onClick={() => navigate("./me")}
                  />
                ) : (
                  <input type="submit" value="Reserve" onClick={addReserve} />
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
                *It may take 20-30 sec to generate. Please do not refresh the
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
                {books ? (
                  books.map((book) => <TableLine book={book} key={book.uuid} />)
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
