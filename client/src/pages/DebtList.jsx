import DebtsTableLine from "../components/DebtsTableLine";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllDebts,
  deleteDebt,
  sendEmail,
  resetDebts,
} from "../features/debt/debtSlice";
import { Link, redirect, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { setPage, setFlexData } from "../features/search/searchSlice";
import { toast } from "react-toastify";

function DebtList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, roles } = useSelector((state) => state.auth);
  const { debts, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.debts
  );
  const { flexData, page, limit, sort } = useSelector((state) => state.search);
  const [keyPressed, setKeyCounter] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [itemsCount, setItemsCount] = useState(0);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      dispatch(setPage(1));
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

    dispatch(getAllDebts({ query: flexData, limit: limit, offset: offset }));

    return () => {
      dispatch(resetDebts());
    };
  }, [keyPressed, page, limit, flexData, isError, message, navigate, dispatch]);

  useEffect(() => {
    if (debts.length > 0 && debts[0].uuid !== "") {
      let counter = 0;
      debts.map((u) => u.books.map((b) => counter++));
      setItemsCount(counter);
    } else {
      setItemsCount(0);
    }
  }, [debts]);

  if (isLoading) {
    return <Spinner />;
  }

  const deletedebt = async (query) => {
    await dispatch(deleteDebt(query));
    setKeyCounter(keyPressed + 1);
  };

  const sendemail = async (query) => {
    await dispatch(sendEmail(query));
    if (isSuccess) {
      toast.info("Email is sent", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setKeyCounter(keyPressed + 1);
  };

  return (
    <>
      <h2>Debts</h2>
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
            if (itemsCount == limit) {
              dispatch(setPage(page + 1));
            }
          }}
        >
          ➡
        </div>
      </div>
      <main>
        <div className="table-box">
          <h5>
            {debts.length} users with {itemsCount} debts in list
          </h5>
          <div className="debt-list">
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>Deadline</th>
                  <th>Note</th>
                  <th>Membership</th>
                  <th>Name - Surname</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Title</th>
                  <th>Year</th>
                </tr>
                {debts.length > 0 && debts[0].uuid !== "" ? (
                  debts.map((usr) =>
                    usr.books.map((bok) => (
                      <DebtsTableLine
                        user={usr}
                        book={bok}
                        userbook={bok.userbook}
                        mail={sendemail}
                        approve={false}
                        decline={deletedebt}
                        key={bok.userbook.uuid}
                      />
                    ))
                  )
                ) : (
                  <DebtsTableLine
                    user={{
                      uuid: "",
                      membership: "",
                      name: "",
                      surname: "",
                      email: "",
                      phone: "",
                    }}
                    book={{
                      uuid: "",
                      title: "",
                      yearPublish: "",
                    }}
                    userbook={{
                      uuid: "",
                      deadline: "",
                      type: "",
                    }}
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

export default DebtList;
