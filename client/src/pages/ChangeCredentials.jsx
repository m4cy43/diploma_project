import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, changeCred, getAuthUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import "./css/form.css";

function ChangeCredentials() {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    password: "",
    password2: "",
    name: "",
    surname: "",
    middlename: "",
    phone: "",
  });

  const {
    email,
    oldPassword,
    password,
    password2,
    name,
    surname,
    middlename,
    phone,
  } = formData;

  const [firstLoad, setFirstLoad] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, full, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
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
    if (firstLoad && full.membership !== "") {
      setFirstLoad(false);
      setFormData((previousState) => ({
        ...previousState,
        email: full.email,
        name: full.name,
        middlename: full.middlename,
        surname: full.surname,
        phone: full.phone,
      }));
    }
    if (full.membership === "") {
      dispatch(getAuthUser());
    }
    if (isSuccess) {
      navigate("/me");
    }

    dispatch(reset());
  }, [full, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      phone !== null &&
      phone !== "" &&
      !phone.match(/^(00|\+)?([0-9]{1,5})?([0-9]{10})$/)
    ) {
      toast.error("Wrong phone format", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (password !== password2) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (
      email !== "" &&
      !email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ) {
      toast.error("Wrong email format", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (password.length < 6) {
      toast.error("Password is too short", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      const userData = {
        email,
        oldPassword,
        password,
        name,
        surname,
        middlename,
        phone,
      };
      dispatch(changeCred(userData));
    }
  };

  return (
    <>
      <p>
        * When changing the name, surname and patronymic, you need to verify
        yourseft again
      </p>
      <main>
        <div className="form-box">
          <h4>Change Credentials</h4>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email@example.com"
              maxLength={100}
              onChange={onChange}
              defaultValue={full.email}
            />
            <input
              type="password"
              name="oldPassword"
              placeholder="Old password"
              maxLength={64}
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              maxLength={64}
              onChange={onChange}
            />
            <input
              type="password"
              name="password2"
              placeholder="Repeat password"
              maxLength={64}
              onChange={onChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Name (optional)"
              maxLength={100}
              onChange={onChange}
              defaultValue={full.name}
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname (optional)"
              maxLength={100}
              onChange={onChange}
              defaultValue={full.surname}
            />
            <input
              type="text"
              name="middlename"
              placeholder="Middlename (optional)"
              maxLength={100}
              onChange={onChange}
              defaultValue={full.middlename}
            />
            <input
              type="text"
              name="phone"
              placeholder="+380987654321 (optional)"
              maxLength={17}
              onChange={onChange}
              defaultValue={full.phone}
            />
            <input type="submit" name="button" value="Enter" />
          </form>
        </div>
      </main>
    </>
  );
}

export default ChangeCredentials;
