import { Link } from "react-router-dom";
import "./css/tableline.css";

function PersonalDebtLine({ debt }) {
  return (
    <tr>
      <td>
        {debt.debt.isDebted ? "Debted" : debt.debt.isBooked ? "Booked" : ""}
      </td>
      <td>{debt.debt.deadlineDate}</td>
      <td>
        <Link to={`/book/${debt.uuid}`}>{debt.title}</Link>
      </td>
      <td>
        {debt.authors.map((el) => {
          return `${el.name} ${el.middlename} ${el.surname} `;
        })}
      </td>
      <td>{debt.year}</td>
    </tr>
  );
}

export default PersonalDebtLine;
