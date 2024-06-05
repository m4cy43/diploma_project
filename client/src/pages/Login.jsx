import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, login } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import "./css/form.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

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

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <>
      <main>
        <div className="form-box">
          <h4>LogIn</h4>
          <form onSubmit={onSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              maxLength={100}
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              maxLength={100}
              onChange={onChange}
            />
            <input type="submit" name="button" value="Enter" />
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;
