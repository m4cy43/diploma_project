import DebtsTableLine from "../components/DebtsTableLine";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetDebts,
  getAllReservings,
  deleteReserving,
  reserveToDebt,
} from "../features/debt/debtSlice";
import { Link, redirect, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { setPage, setFlexData } from "../features/search/searchSlice";
import { toast } from "react-toastify";

function DebtList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, roles } = useSelector((state) => state.auth);
  const { reservings, isLoading, isError, message } = useSelector(
    (state) => state.debts
  );
  const { flexData, page, limit, sort } = useSelector((state) => state.search);
  const [keyPressed, setKeyCounter] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [deadlineVal, setDeadline] = useState(14);
  const [noteVal, setNote] = useState("");
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
      toast.error(message, {
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

    dispatch(
      getAllReservings({ query: flexData, limit: limit, offset: offset })
    );

    return () => {
      dispatch(resetDebts());
    };
  }, [keyPressed, page, limit, flexData, isError, message, navigate, dispatch]);

  useEffect(() => {
    if (reservings.length > 0 && reservings[0].uuid !== "") {
      let counter = 0;
      reservings.map((u) => u.books.map((b) => counter++));
      setItemsCount(counter);
    } else {
      setItemsCount(0);
    }
  }, [reservings]);

  if (isLoading) {
    return <Spinner />;
  }

  const deletereserv = async (query) => {
    await dispatch(deleteReserving(query));
    setKeyCounter(keyPressed + 1);
  };

  const restodebt = async (data) => {
    await dispatch(reserveToDebt(data));
    setKeyCounter(keyPressed + 1);
  };

  return (
    <>
      <h2>Reservings</h2>
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
        &nbsp;&nbsp;&nbsp;
        <input
          type="number"
          name="deadline"
          placeholder="deadline"
          max={60}
          min={-7}
          maxLength={2}
          style={{ width: "50px" }}
          onChange={(e) => setDeadline(e.target.value)}
        />
        &nbsp;&nbsp;&nbsp;
        <input
          type="text"
          name="note"
          placeholder="note"
          style={{ width: "250px" }}
          maxLength={90}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <main>
        <div className="table-box">
          <h5>
            {reservings.length} users with {itemsCount} reservings in list
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
                {reservings.length > 0 && reservings[0].uuid !== "" ? (
                  reservings.map((usr) =>
                    usr.books.map((bok) => (
                      <DebtsTableLine
                        user={usr}
                        book={bok}
                        userbook={bok.userbook}
                        approve={() =>
                          restodebt({
                            uuid: bok.userbook.uuid,
                            deadline: !(
                              deadlineVal < -7 ||
                              deadlineVal > 60 ||
                              deadlineVal === ""
                            )
                              ? deadlineVal
                              : 14,
                            note: noteVal,
                          })
                        }
                        decline={deletereserv}
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
