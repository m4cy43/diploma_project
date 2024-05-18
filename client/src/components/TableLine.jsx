import { Link } from "react-router-dom";
import "./css/tableline.css";

function TableLine({ book }) {
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
            <Link to={`/author/${el.uuid}`} key={el.uuid}>
              {ElName} {ElMiddle} {ElSur}
            </Link>
          );
        })}
      </td>
      <td>{book.yearPublish}</td>
      <td>
        {book.genres.map((el) => {
          return (
            <Link to={`/genre/${el.uuid}`} key={el.uuid}>
              {el.genre}
            </Link>
          );
        })}
      </td>
      <td>{book.publisher ? book.publisher.publisher : ""}</td>
    </tr>
  );
}

export default TableLine;
