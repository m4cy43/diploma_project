import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, register } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import "./css/form.css";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    name: "",
    surname: "",
    middlename: "",
    phone: "",
  });

  const { email, password, password2, name, surname, middlename, phone } =
    formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, message } = useSelector(
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

    if (isSuccess || (user && user.token !== "")) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (phone !== "" && !phone.match(/^\+(380)[0-9]{9}$/)) {
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
    } else {
      const userData = {
        email,
        password,
        name,
        surname,
        middlename,
        phone,
      };
      dispatch(register(userData));
    }
  };

  return (
    <>
      <main>
        <div className="form-box">
          <h4>Registration</h4>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email@example.com"
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={onChange}
            />
            <input
              type="password"
              name="password2"
              placeholder="Repeat password"
              onChange={onChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Name (optional)"
              onChange={onChange}
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname (optional)"
              onChange={onChange}
            />
            <input
              type="text"
              name="middlename"
              placeholder="Middlename (optional)"
              onChange={onChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="+380987654321 (optional)"
              onChange={onChange}
            />
            <input type="submit" name="button" value="Enter" />
          </form>
        </div>
      </main>
    </>
  );
}

export default Register;
