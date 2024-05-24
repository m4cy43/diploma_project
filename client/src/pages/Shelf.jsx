import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getLatest,
  simpleFind,
  advancedFind,
  getByHeading,
  getRecommended,
  resetBooks,
} from "../features/book/bookSlice";
import {
  getDebtsAuth,
  getReservingsAuth,
  getBookmarksAuth,
  resetDebts,
} from "../features/debt/debtSlice";
import { setPage } from "../features/search/searchSlice";
import Spinner from "../components/Spinner";
import TableLine from "../components/TableLine";
import "./css/tables.css";

function Shelf() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { books, recommended, isLoading, isError, message, similarLoading } =
    useSelector((state) => state.books);
  const debtState = useSelector((state) => state.debts);
  const { debts, reservings, bookmarks } = debtState;
  const {
    searchType,
    flexData,
    advancedData,
    headingData,
    headingType,
    page,
    limit,
    sort,
  } = useSelector((state) => state.search);

  const [recommedKeyPressed, setRecommendKey] = useState(false);

  useEffect(() => {
    let offset = (page - 1) * limit;

    if (isError) {
      console.log(message);
    }

    if (searchType === "latest") {
      dispatch(getLatest({ limit: limit, offset: offset, sort: sort }));
    }
    if (searchType === "flex") {
      dispatch(
        simpleFind({
          query: flexData,
          limit,
          offset,
          sort,
        })
      );
    }
    if (searchType === "advanced") {
      dispatch(
        advancedFind({ query: { limit, offset, sort }, body: advancedData })
      );
    }
    if (searchType === "heading") {
      dispatch(
        getByHeading({
          heading: headingType,
          uuid: headingData,
          limit,
          offset,
          sort,
        })
      );
    }

    return () => {
      dispatch(resetBooks());
    };
  }, [
    user,
    searchType,
    flexData,
    advancedData,
    headingData,
    limit,
    page,
    sort,
    navigate,
    isError,
    message,
    dispatch,
  ]);

  useEffect(() => {
    if (
      recommedKeyPressed &&
      debtState.debtsAreLoaded &&
      debtState.reservingsAreLoaded &&
      debtState.bookmarksAreLoaded
    ) {
      const debtArr =
        debts.length > 0 && debts[0].uuid !== ""
          ? debts[0].books.map((x) => x.uuid)
          : [];
      const reservingsArr =
        reservings.length > 0 && reservings[0].uuid !== ""
          ? reservings[0].books.map((x) => x.uuid)
          : [];
      const bookmarksArr =
        bookmarks.length > 0 && bookmarks[0].uuid !== ""
          ? bookmarks[0].books.map((x) => x.uuid)
          : [];

      const JsonArray = JSON.stringify([
        ...debtArr,
        ...reservingsArr,
        ...bookmarksArr,
      ]);
      setRecommendKey(false);
      dispatch(getRecommended(JsonArray));
      dispatch(resetDebts());
    }
  }, [debtState, recommedKeyPressed]);

  const loadRecommendations = async () => {
    setRecommendKey(true);
    await dispatch(getDebtsAuth());
    await dispatch(getReservingsAuth());
    await dispatch(getBookmarksAuth());
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Shelf</h2>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*You can use
        search and advanced search located on header. Also some headings of the
        book in the table and book page are interactable.
      </p>
      <main>
        <div className="table-box">
          <h5>{books.length} results on page</h5>
          <div className="arrows">
            <div
              className="arrow"
              onClick={() => {
                if (page > 1) {
                  dispatch(setPage(page - 1));
                }
              }}
            >
              ⬅
            </div>
            <div>{page}</div>
            <div
              className="arrow"
              onClick={() => {
                if (books.length == limit) {
                  dispatch(setPage(page + 1));
                }
              }}
            >
              ➡
            </div>
          </div>
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
        {user && user.token !== "" && (
          <div className="similar">
            {similarLoading ? (
              <Spinner />
            ) : (
              <p>
                *It may take 15-30 sec to generate. Please do not refresh the
                page, or it will load longer. For generation you need to have
                one or more bookmarks, reservings, debts.
              </p>
            )}
            <button onClick={loadRecommendations}>Get recommendations</button>
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
        )}
      </main>
    </>
  );
}

export default Shelf;
