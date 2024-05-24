import "./css/tableline.css";

function VerifyTableLine({ user, set, del, flag }) {
  return (
    <tr>
      <td>
        <input
          type="submit"
          value="+"
          onClick={() => {
            set(user.uuid);
          }}
        />
        {(flag === "unverified" || flag === "admin") && (
          <>
            &nbsp;
            <input
              type="submit"
              value="-"
              onClick={() => {
                del(user.uuid);
              }}
            />
          </>
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

export default VerifyTableLine;
