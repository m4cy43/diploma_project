import { Link } from "react-router-dom";
import "./css/tableline.css";

function DebtsTableLine({ user, book, userbook, approve, decline, mail }) {
  return (
    <tr>
      <td>
        {approve ? (
          <input
            type="submit"
            value="+"
            className="plusBut"
            onClick={approve}
          />
        ) : (
          <></>
        )}
        {decline ? (
          <input
            type="submit"
            value="-"
            className="minusBut"
            onClick={() => {
              decline(userbook.uuid);
            }}
          />
        ) : (
          <></>
        )}
        {mail ? (
          <input
            type="submit"
            value="M"
            className="setBut"
            onClick={() => {
              mail(user.uuid);
            }}
          />
        ) : (
          <></>
        )}
      </td>
      {Date.now() - Date.parse(userbook.deadline) > 0 ? (
        <td style={{ color: "red" }}>{userbook.deadline}</td>
      ) : (
        <td>{userbook.deadline}</td>
      )}
      <td>{userbook.note}</td>
      <td>{user.membership}</td>
      <td>
        {user.name} {user.surname}
      </td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
      <td>
        <Link to={`/book/${book.uuid}`}>{book.title}</Link>
      </td>
      <td>{book.yearPublish}</td>
    </tr>
  );
}

export default DebtsTableLine;
