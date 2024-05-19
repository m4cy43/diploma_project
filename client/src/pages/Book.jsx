import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  // deleteBook,
  oneBook,
  getByHeading,
  resetBooks,
  // incBookNum,
  // decBookNum,
} from "../features/book/bookSlice";
import Spinner from "../components/Spinner";
import "./css/book.css";
// import {
//   bookTheBook,
//   oneBookDebt,
//   resetDebts,
//   unbookTheBook,
// } from "../features/debt/debtSlice";
import {
  setPage,
  setSearchType,
  setHeadingData,
  setHeadingType,
} from "../features/search/searchSlice";

function Book() {
  const { uuid } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { book, isLoading, isError, message } = useSelector(
    (state) => state.books
  );
  const { searchType, page, limit, sort, logic } = useSelector(
    (state) => state.search
  );
  // const { debts } = useSelector((state) => state.debts);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    // dispatch(oneBookDebt(uuid));
    dispatch(oneBook(uuid));

    return () => {
      // dispatch(resetDebts());
      dispatch(resetBooks());
    };
  }, [isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  // const delTheBook = async () => {
  //   await dispatch(deleteBook(uuid));
  //   await navigate("/");
  //   return async () => {
  //     await dispatch(resetBooks());
  //   };
  // };

  // const takeBook = () => {
  //   dispatch(bookTheBook(uuid));
  //   return () => {
  //     dispatch(resetDebts());
  //   };
  // };

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
                    {el.name} {el.surname} {el.middlename}
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
          {/* <div className="book-bottom-panel">
            {user.roles && user.roles.includes("admin") ? (
              <input
                type="submit"
                value="Delete the book"
                onClick={delTheBook}
              />
            ) : user.isVerified ? (
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
              )
            ) : (
              <input type="submit" value="Verify account first" />
            )}
          </div> */}
        </div>
      </main>
    </>
  );
}

export default Book;
