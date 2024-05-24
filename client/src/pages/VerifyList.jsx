import VerifyTableLine from "../components/VerifyTableLine";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getByRoleAndMembership,
  verifyUser,
  updUser,
  delUser,
  resetUsers,
} from "../features/user/userSlice";
import { Link, redirect, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { setPage, setFlexData } from "../features/search/searchSlice";

function VerifyList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, roles } = useSelector((state) => state.auth);
  const { users, isLoading, isError, message } = useSelector(
    (state) => state.user
  );
  const { flexData, page, limit, sort } = useSelector((state) => state.search);
  const [keyPressed, setKeyCounter] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [role, setRole] = useState("unverified");

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      dispatch(setFlexData("_"));
    }
    let offset = (page - 1) * limit;

    if (!user || user.token === "") {
      navigate("/login");
    }
    if (roles.length > 0 && !roles.includes("admin")) {
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

  const verify = async (query) => {
    await dispatch(verifyUser(query));
    setKeyCounter(keyPressed + 1);
  };

  const deluser = async (query) => {
    await dispatch(delUser(query));
    setKeyCounter(keyPressed + 1);
  };

  return (
    <>
      <h2>Verify list</h2>
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
          <option value={"unverified"}>role</option>
          <option value={"unverified"}>unverified</option>
          <option value={"verified"}>verified</option>
        </select>
      </div>
      <main>
        <div className="table-box">
          <h5>{users.length} users in list</h5>
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
                      set={verify}
                      del={deluser}
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

export default VerifyList;
