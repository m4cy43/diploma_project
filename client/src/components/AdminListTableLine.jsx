import "./css/tableline.css";

function AdminListTableLine({ user, set, del, updname, flag }) {
  return (
    <tr>
      <td>
        {flag === "verified" && (
          <input
            type="submit"
            value="+"
            className="plusBut"
            onClick={() => {
              set(user.uuid);
            }}
          />
        )}
        &nbsp;
        {flag === "admin" && (
          <input
            type="submit"
            value="-"
            className="minusBut"
            onClick={() => {
              del(user.uuid);
            }}
          />
        )}
      </td>
      <td>{user.updatedAt.split("T")[0]}</td>
      <td>{user.membership}</td>
      <td>{`${user.name} ${user.middlename} ${user.surname}`}</td>
      <td>{user.email}</td>
      <td>{user.phone}</td>
    </tr>
  );
}

export default AdminListTableLine;
