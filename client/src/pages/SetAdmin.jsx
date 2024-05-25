import VerifyTableLine from "../components/VerifyTableLine";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getByRoleAndMembership,
  setAdmin,
  delAdmin,
  resetUsers,
} from "../features/user/userSlice";
import { Link, redirect, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { setPage, setFlexData } from "../features/search/searchSlice";

function SetAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, roles } = useSelector((state) => state.auth);
  const { users, isLoading, isError, message } = useSelector(
    (state) => state.user
  );
  const { flexData, page, limit, sort } = useSelector((state) => state.search);
  const [keyPressed, setKeyCounter] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [role, setRole] = useState("verified");

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      dispatch(setFlexData("_"));
    }
    let offset = (page - 1) * limit;

    if (!user || user.token === "") {
      navigate("/login");
    }
    if (roles.length > 0 && !roles.includes("main")) {
      navigate("/");
    }
    if (isError) {
      console.log(message);
    }

    dispatch(
      getByRoleAndMembership({
        query: flexData,
        role: role,
        limit: limit,
        offset: offset,
      })
    );

    return () => {
      dispatch(resetUsers());
    };
  }, [keyPressed, page, role, flexData, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const setadm = async (query) => {
    await dispatch(setAdmin(query));
    setKeyCounter(keyPressed + 1);
  };

  const deladm = async (query) => {
    if (window.confirm("Do you really want to remove admin rights?")) {
      await dispatch(delAdmin(query));
      setKeyCounter(keyPressed + 1);
    }
  };

  return (
    <>
      <h2>Set Admin</h2>
      <div className="arrows">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div
          className="arrow"
          onClick={() => {
            if (page > 1) {
              dispatch(setPage(page - 1));
            }
          }}
        >
          ⬅
        </div>
        <div>{page}</div>
        <div
          className="arrow"
          onClick={() => {
            if (users.length == limit) {
              dispatch(setPage(page + 1));
            }
          }}
        >
          ➡
        </div>
        &nbsp;&nbsp;&nbsp;
        <select
          onChange={(e) => {
            setRole(e.target.value);
            dispatch(setPage(1));
            dispatch(setFlexData("_"));
          }}
        >
          <option value={"verified"}>role</option>
          <option value={"verified"}>verified</option>
          <option value={"admin"}>admin</option>
        </select>
      </div>
      <main>
        <div className="table-box">
          <h5>
            {users.length} {role} users in list
          </h5>
          <div className="debt-list">
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Membership</th>
                  <th>Surname - Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
                {users ? (
                  users.map((user) => (
                    <VerifyTableLine
                      user={user}
                      set={setadm}
                      del={deladm}
                      flag={role}
                      key={user.uuid}
                    />
                  ))
                ) : (
                  <VerifyTableLine
                    user={{
                      updatedAt: "",
                      name: "",
                      surname: "",
                      email: "",
                      phone: "",
                    }}
                    set={false}
                    del={false}
                    flag={role}
                    key={""}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default SetAdmin;
