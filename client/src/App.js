import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shelf from "./pages/Shelf";
// import Book from "./pages/Book";
// import Author from "./pages/Author";
// import NewBookForm from "./pages/NewBookForm";
// import VerifyList from "./pages/VerifyList";
// import BookingList from "./pages/BookingList";
// import DebtList from "./pages/DebtList";
// import SetAdmin from "./pages/SetAdmin";
// import PersonalAccount from "./pages/PersonalAccount";
// import ChangeCredentials from "./pages/ChangeCredentials";
// import AuthorsList from "./pages/AuthorsList";
// import CreateNewAuthor from "./pages/CreateNewAuthor";
// import GenresList from "./pages/GenresList";
// import CreateNewGenre from "./pages/CreateNewGenre";
// import SectionsList from "./pages/SectionsList";
// import CreateNewSection from "./pages/CreateNewSection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Shelf />} />
            {/* <Route path="/book/:uuid" element={<Book />} />
            <Route path="/author/:uuid" element={<Author />} />
            <Route path="/newbook" element={<NewBookForm />} />
            <Route path="/verifylist" element={<VerifyList />} />
            <Route path="/bookinglist" element={<BookingList />} />
            <Route path="/debtlist" element={<DebtList />} />
            <Route path="/setadmin" element={<SetAdmin />} />
            <Route path="/me" element={<PersonalAccount />} />
            <Route path="/chngcred" element={<ChangeCredentials />} />
            <Route path="/authorslist" element={<AuthorsList />} />
            <Route path="/createauthor" element={<CreateNewAuthor />} />
            <Route path="/genreslist" element={<GenresList />} />
            <Route path="/creategenre" element={<CreateNewGenre />} />
            <Route path="/sectionslist" element={<SectionsList />} />
            <Route path="/createsection" element={<CreateNewSection />} /> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
