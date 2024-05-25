import { Link } from "react-router-dom";
import "./css/tableline.css";
import {
  setPage,
  setSearchType,
  setHeadingData,
  setHeadingType,
} from "../features/search/searchSlice";
import { useDispatch } from "react-redux";

function TableLine({ book }) {
  const dispatch = useDispatch();
  const headingFinder = (uuid, type) => {
    dispatch(setPage(1));
    dispatch(setSearchType("heading"));
    dispatch(setHeadingType(type));
    dispatch(setHeadingData(uuid));
  };

  return (
    <tr>
      <td>{book.number}</td>
      <td>
        <Link to={`/book/${book.uuid}`}>{book.title}</Link>
      </td>
      <td>
        {book.authors.map((el) => {
          const ElName = el.name === "_" ? "" : el.name;
          const ElMiddle = el.middlename === "_" ? "" : el.middlename;
          const ElSur = el.surname === "_" ? "" : el.surname;
          return (
            <Link
              to={`../`}
              key={el.uuid}
              onClick={() => headingFinder(el.uuid, "author")}
            >
              {ElName} {ElMiddle} {ElSur}
            </Link>
          );
        })}
      </td>
      <td>{book.yearPublish}</td>
      <td>
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
      </td>
      <td>
        {book.publisher ? (
          <Link
            to={`../`}
            key={book.publisher.uuid}
            onClick={() => headingFinder(book.publisher.uuid, "publisher")}
          >
            {book.publisher.publisher}
          </Link>
        ) : (
          "--"
        )}
      </td>
      <td>{book.rate}</td>
    </tr>
  );
}

export default TableLine;
