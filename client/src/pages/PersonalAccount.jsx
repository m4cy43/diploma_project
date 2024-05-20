import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getDebts, resetDebts } from "../features/debt/debtSlice";
import { reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import "./css/account.css";
import PersonalDebtLine from "../components/PersonalDebtLine";

function PersonalAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, roles } = auth;
  const { debts, isLoading, isError, message } = useSelector(
    (state) => state.debts
  );

  useEffect(() => {
    if (auth.isError) {
      console.log(auth.message);
    }
    // if (isError) {
    //   console.log(message);
    // }

    // dispatch(getBoth());

    return () => {
      dispatch(reset());
      // dispatch(resetDebts());
    };
    // }, [auth, navigate, isError, message, dispatch]);
  }, [auth, navigate, dispatch]);

  if (auth.isLoading) {
    return <Spinner />;
  }

  const changeCred = () => {
    navigate("/chngcred");
  };

  return (
    <>
      <h2>Personal Account</h2>
      <main>
        <div className="account-box">
          <div className="personal-data-box">
            <h5>Personal data</h5>
            <div className="personal-data">
              <h6>
                <span>Membership: </span>
                {user.membership}
              </h6>
              <h6>
                <span>Email: </span>
                {user.email}
              </h6>
              <h6>
                <span>Name: </span>
                {user.name}
              </h6>
              <h6>
                <span>Middlename: </span>
                {user.middlename}
              </h6>
              <h6>
                <span>Surname: </span>
                {user.surname}
              </h6>
              <h6>
                <span>Phone: </span>
                {user.phone}
              </h6>
              <h6>
                <span>Roles: </span>
                {roles.join(", ")}
              </h6>
              <input
                type="button"
                value="Change credentials"
                onClick={changeCred}
              />
            </div>
          </div>
          <div className="debt-list-box">
            <h5>
              {debts.user.length !== 0 ? debts.user[0].books.length : 0} books
              in this list
            </h5>
            <div className="debt-list">
              <table>
                <tbody>
                  <tr>
                    <th>Deadline</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                  </tr>
                  {debts.user.length !== 0 ? (
                    debts.user[0].books.map((debt) => (
                      <PersonalDebtLine debt={debt} key={debt.uuid} />
                    ))
                  ) : (
                    <PersonalDebtLine
                      debt={{
                        title: "",
                        authors: [{ name: "", surname: "", middlename: "" }],
                        year: "",
                        debt: {
                          deadlineDate: "",
                          isDebted: false,
                          isBooked: false,
                        },
                      }}
                      key={""}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default PersonalAccount;
