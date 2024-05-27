import { Link } from "react-router-dom";
import "./css/tableline.css";

function PersonalDebtLine({ data }) {
  return (
    <tr>
      {data.userbook.deadline !== "" && data.userbook.type !== "bookmark" ? (
        Date.now() - Date.parse(data.userbook.deadline) > 0 ? (
          <td style={{ color: "red" }}>{data.userbook.deadline}</td>
        ) : (
          <td>{data.userbook.deadline}</td>
        )
      ) : (
        ""
      )}
      <td>
        <Link to={`/book/${data.uuid}`}>{data.title}</Link>
      </td>
      <td>{data.yearPublish}</td>
      <td>{data.userbook.note}</td>
    </tr>
  );
}

export default PersonalDebtLine;
