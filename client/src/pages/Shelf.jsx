import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getLatest,
  simpleFind,
  advancedFind,
  getByHeading,
  resetBooks,
} from "../features/book/bookSlice";
import { setPage } from "../features/search/searchSlice";
import Spinner from "../components/Spinner";
import TableLine from "../components/TableLine";
import "./css/tables.css";

function Shelf() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { books, isLoading, isError, message } = useSelector(
    (state) => state.books
  );
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Shelf</h2>
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
      </main>
    </>
  );
}

export default Shelf;
