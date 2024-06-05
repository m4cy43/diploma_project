import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDebtsAuth,
  getReservingsAuth,
  getBookmarksAuth,
  resetDebts,
} from "../features/debt/debtSlice";
import {
  reset,
  getAuthUser,
  getRoles,
  deleteMe,
} from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import "./css/account.css";
import PersonalDebtLine from "../components/PersonalDebtLine";
import { toast } from "react-toastify";

function PersonalAccount() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, full, roles } = auth;
  const debtsState = useSelector((state) => state.debts);
  const { debts, reservings, bookmarks } = debtsState;

  useEffect(() => {
    if (!user || user.token === "") {
      navigate("/login");
    }

    if (auth.isError) {
      console.log(auth.message);
    }

    dispatch(getAuthUser());
    dispatch(getRoles());

    return () => {
      dispatch(reset());
    };
  }, [auth.isError, auth.message, dispatch]);

  useEffect(() => {
    if (debtsState.isError) {
      console.log(debtsState.message);
    }

    dispatch(getDebtsAuth());
    dispatch(getReservingsAuth());
    dispatch(getBookmarksAuth());

    return () => {
      dispatch(resetDebts());
    };
  }, [user]);

  const changeCred = () => {
    dispatch(reset());
    navigate("/chngcred");
  };

  const deleteAcc = () => {
    if (
      (debts.length > 0 && debts[0].uuid !== "") ||
      (reservings.length > 0 && reservings[0].uuid !== "")
    ) {
      toast.error(
        "You have debts or reservations, so you cant delete your account",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    } else if (window.confirm("Do you really want to delete you account")) {
      dispatch(deleteMe());
      navigate("/");
    }
  };

  if (auth.isLoading) {
    return <Spinner />;
  }

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
                {full.membership}
              </h6>
              <h6>
                <span>Email: </span>
                {full.email}
              </h6>
              <h6>
                <span>Name: </span>
                {full.name}
              </h6>
              <h6>
                <span>Middlename: </span>
                {full.middlename}
              </h6>
              <h6>
                <span>Surname: </span>
                {full.surname}
              </h6>
              <h6>
                <span>Phone: </span>
                {full.phone}
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
              <input
                type="button"
                value="Delete account"
                id="delete-acc-butt"
                onClick={deleteAcc}
              />
            </div>
          </div>
          <div className="debt-list-box">
            <h5>
              {debts.length > 0 && debts[0].uuid !== ""
                ? debts[0].books.length
                : 0}{" "}
              books in debt list
            </h5>
            <div className="debt-list">
              <table>
                <tbody>
                  <tr>
                    <th>Deadline</th>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Note</th>
                  </tr>
                  {debts.length > 0 ? (
                    debts[0].books.map((data) => (
                      <PersonalDebtLine data={data} key={data.uuid} />
                    ))
                  ) : (
                    <PersonalDebtLine
                      data={{
                        title: "",
                        authors: [{ name: "", surname: "", middlename: "" }],
                        year: "",
                        note: "",
                        userbook: {
                          deadline: "",
                          type: "",
                        },
                      }}
                      key={""}
                    />
                  )}
                </tbody>
              </table>
            </div>
            <h5>
              {reservings.length > 0 && reservings[0].uuid !== ""
                ? reservings[0].books.length
                : 0}{" "}
              books in reserving list
            </h5>
            <div className="debt-list">
              <table>
                <tbody>
                  <tr>
                    <th>Deadline</th>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Note</th>
                  </tr>
                  {reservings.length > 0 ? (
                    reservings[0].books.map((data) => (
                      <PersonalDebtLine data={data} key={data.uuid} />
                    ))
                  ) : (
                    <PersonalDebtLine
                      data={{
                        title: "",
                        authors: [{ name: "", surname: "", middlename: "" }],
                        year: "",
                        note: "",
                        userbook: {
                          deadline: "",
                          type: "",
                        },
                      }}
                      key={""}
                    />
                  )}
                </tbody>
              </table>
            </div>
            <h5>
              {bookmarks.length > 0 && bookmarks[0].uuid !== ""
                ? bookmarks[0].books.length
                : 0}{" "}
              books in bookmarks list
            </h5>
            <div className="debt-list">
              <table>
                <tbody>
                  <tr>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Note</th>
                  </tr>
                  {bookmarks.length > 0 ? (
                    bookmarks[0].books.map((data) => (
                      <PersonalDebtLine data={data} key={data.uuid} />
                    ))
                  ) : (
                    <PersonalDebtLine
                      data={{
                        title: "",
                        authors: [{ name: "", surname: "", middlename: "" }],
                        year: "",
                        note: "",
                        userbook: {
                          deadline: "",
                          type: "",
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
