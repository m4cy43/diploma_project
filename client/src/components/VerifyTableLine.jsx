import "./css/tableline.css";

function VerifyTableLine({ user, set, del, updname, flag }) {
  return (
    <tr>
      <td>
        {flag === "unverified" && (
          <input
            type="submit"
            value="+"
            className="plusBut"
            onClick={() => {
              set(user.uuid);
            }}
          />
        )}
        <input
          type="submit"
          value="-"
          className="minusBut"
          onClick={() => {
            del(user.uuid);
          }}
        />
        {/* {(flag === "unverified" || flag === "admin") && (
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
        )} */}
        {flag === "unverified" && (
          <>
            <input
              type="submit"
              value="set"
              className="setBut"
              onClick={() => {
                updname();
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
