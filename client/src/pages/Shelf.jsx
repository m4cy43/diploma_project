import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLatest, resetBooks } from "../features/book/bookSlice";
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
  const { limit, sort } = useSelector((state) => state.other);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    // if (!user || user.uuid === "") {
    //   navigate("/login");
    // }

    dispatch(
      getLatest({ limit: limit, offset: offset, sort: "authorNameASC" })
    );
    return () => {
      dispatch(resetBooks());
    };
  }, [user, limit, offset, sort, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h2>Shelf</h2>
      <main>
        <div className="table-box">
          <h5>{books.length} books found</h5>
          <div className="arrows">
            <div
              className="arrow"
              onClick={() => {
                if (offset > 0) setOffset(offset - 1);
              }}
            >
              ⬅
            </div>
            <div>{offset + 1}</div>
            <div
              className="arrow"
              onClick={() => {
                setOffset(offset + 1);
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
