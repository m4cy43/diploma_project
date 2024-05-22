import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./css/newbook.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Spinner from "../components/Spinner";
import {
  getAuthors,
  getGenres,
  getPublishers,
  getSections,
  getIsbns,
  resetHeadings,
} from "../features/headings/headingSlice";
import { createBook } from "../features/book/bookSlice";

function NewBookForm() {
  const [formData, setFormData] = useState({
    title: "_",
    originalTitle: "_",
    yearPublish: "_",
    yearAuthor: "_",
    bibliography: "_",
    annotation: "_",
    physicalDescription: "_",
    note: "_",
    udk: "_",
    bbk: "_",
    number: 1,
    rate: 0,
    genre: [
      {
        genre: "_",
      },
    ],
    author: [
      {
        name: "_",
        surname: "_",
        middlename: "_",
      },
    ],
    section: {
      section: "_",
    },
    publisher: {
      publisher: "_",
    },
    isbn: [
      {
        isbn: "_",
      },
    ],
  });

  const {
    title,
    originalTitle,
    yearPublish,
    yearAuthor,
    bibliography,
    annotation,
    physicalDescription,
    note,
    udk,
    bbk,
    number,
    rate,
    author,
    genre,
    section,
    publisher,
    isbn,
  } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    authors,
    genres,
    publishers,
    sections,
    isbns,
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.headings);
  const { user, roles } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || user.token === "") {
      navigate("/login");
    }
    if (roles.length > 0 && !roles.includes("admin")) {
      navigate("/");
    }
    if (isError) {
      console.error(message);
    }

    // dispatch(getAuthors({ query: "_", limit: 3000, offset: 0 }));
    // dispatch(getGenres({ query: "_", limit: 3000, offset: 0 }));
    // dispatch(getPublishers({ query: "_", limit: 200, offset: 0 }));
    // dispatch(getSections({ query: "_", limit: 100, offset: 0 }));
    // dispatch(getIsbns({ query: "_", limit: 10000, offset: 0 }));

    return () => {
      dispatch(resetHeadings());
    };
  }, [isError, message, navigate, dispatch]);

  // if (isLoading) {
  //   return <Spinner />;
  // }

  let numberOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
  ];

  let authorsOptions = authors.map((el) => {
    return {
      value: { name: el.name, surname: el.surname, middlename: el.middlename },
      label: `${el.name} ${el.middlename} ${el.surname}`,
    };
  });

  let genresOptions = genres.map((el) => {
    return {
      value: { genre: el.genre },
      label: el.genre,
    };
  });

  let publishersOptions = publishers.map((el) => {
    return {
      value: { publisher: el.publisher },
      label: el.publisher,
    };
  });

  let sectionsOptions = sections.map((el) => {
    return {
      value: { section: el.section },
      label: el.section,
    };
  });

  let isbnOptions = isbns.map((el) => {
    return {
      value: { isbn: el.isbn },
      label: el.isbn,
    };
  });

  const onChange = (e) => {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSelectChangeAuthors = (data) => {
    let val = data.map((el) => {
      if (el.value.name) {
        return {
          name: el.value.name,
          surname: el.value.surname,
          middlename: el.value.middlename,
        };
      } else {
        let x = el.value.split(" ").filter((y) => y !== "" || y !== " ");
        if (x.length === 0) return { name: "_", middlename: "_", surname: "_" };
        if (x.length === 1)
          return { name: x[0], middlename: "_", surname: "_" };
        if (x.length === 2)
          return { name: x[0], middlename: "_", surname: x[1] };
        if (x.length === 3)
          return { name: x[0], middlename: x[2], surname: x[1] };
        if (x.length > 3) return { name: x[0], middlename: "_", surname: "_" };
      }
    });
    setFormData((previousState) => ({
      ...previousState,
      author: val,
    }));
  };
  const onSelectChangeGenres = (data) => {
    let val = data.map((el) => {
      return el.value.genre ? el.value : { genre: el.value };
    });
    setFormData((previousState) => ({
      ...previousState,
      genre: val,
    }));
  };
  const onSelectChangeIsbns = (data) => {
    let val = data.map((el) => {
      return { isbn: el.value };
    });
    setFormData((previousState) => ({
      ...previousState,
      isbn: val,
    }));
  };
  const onSelectChangeNumber = (data) => {
    setFormData((previousState) => ({
      ...previousState,
      number: data.value,
    }));
  };
  const onSelectChangeSection = (data) => {
    let val = data.value.section ? data.value : { section: data.value };
    setFormData((previousState) => ({
      ...previousState,
      section: val,
    }));
  };
  const onSelectChangePublisher = (data) => {
    let val = data.value.publisher ? data.value : { publisher: data.value };
    setFormData((previousState) => ({
      ...previousState,
      publisher: val,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      title,
      originalTitle,
      yearPublish,
      yearAuthor,
      bibliography,
      annotation,
      physicalDescription,
      note,
      udk,
      bbk,
      number,
      rate,
      authors: author,
      genres: genre,
      section,
      publisher,
      isbns: isbn,
    };
    await dispatch(resetHeadings());
    await dispatch(createBook(bookData));
    await navigate("/");
  };

  return (
    <>
      <main>
        <div className="form-box" id="create-book-box">
          <h4>Create new Book</h4>
          <form
            onSubmit={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
          >
            <div className="first-row">
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                onChange={onChange}
              />
              <input
                type="text"
                name="yearAuthor"
                placeholder="Year by Author"
                onChange={onChange}
              />
            </div>
            <div className="first-row">
              <input
                type="text"
                name="originalTitle"
                placeholder="Enter original title"
                onChange={onChange}
              />
              <input
                type="text"
                name="yearPublish"
                placeholder="Year by Publisher"
                onChange={onChange}
              />
            </div>
            <div className="second-row">
              <CreatableSelect
                placeholder="Choose authors"
                isMulti
                options={authorsOptions}
                onChange={onSelectChangeAuthors}
                onMenuOpen={() =>
                  dispatch(getAuthors({ query: "_", limit: 3000, offset: 0 }))
                }
                onMenuClose={() => dispatch(resetHeadings())}
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary25: "#68b16f",
                    primary: "#d6d6d6",
                  },
                })}
              />
              <CreatableSelect
                placeholder="Choose genres"
                isMulti
                options={genresOptions}
                onChange={onSelectChangeGenres}
                onMenuOpen={() =>
                  dispatch(getGenres({ query: "_", limit: 3000, offset: 0 }))
                }
                onMenuClose={() => resetHeadings()}
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary25: "#68b16f",
                    primary: "#d6d6d6",
                  },
                })}
              />
            </div>
            <div className="second-row">
              <CreatableSelect
                placeholder="Choose publisher"
                options={publishersOptions}
                onChange={onSelectChangePublisher}
                onMenuOpen={() =>
                  dispatch(
                    getPublishers({ query: "_", limit: 3000, offset: 0 })
                  )
                }
                onMenuClose={() => dispatch(resetHeadings())}
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary25: "#68b16f",
                    primary: "#d6d6d6",
                  },
                })}
              />
              <CreatableSelect
                placeholder="Choose section"
                options={sectionsOptions}
                onChange={onSelectChangeSection}
                onMenuOpen={() =>
                  dispatch(getSections({ query: "_", limit: 3000, offset: 0 }))
                }
                onMenuClose={() => dispatch(resetHeadings())}
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary25: "#68b16f",
                    primary: "#d6d6d6",
                  },
                })}
              />
            </div>
            <div className="third-row">
              <input
                type="text"
                name="bbk"
                placeholder="BBK"
                onChange={onChange}
              />
              <input
                type="text"
                name="udk"
                placeholder="UDK"
                onChange={onChange}
              />
              <CreatableSelect
                placeholder="ISBN"
                isMulti
                // options={isbnOptions}
                onChange={onSelectChangeIsbns}
                className="react-select-container"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 2,
                  colors: {
                    ...theme.colors,
                    primary25: "#68b16f",
                    primary: "#d6d6d6",
                  },
                })}
              ></CreatableSelect>
            </div>
            <div className="third-row">
              <input
                type="text"
                name="number"
                placeholder="Number"
                onChange={onChange}
              />
              <input
                type="text"
                name="rate"
                placeholder="Rate"
                onChange={onChange}
              />
              <input
                type="text"
                name="physicalDescription"
                placeholder="Physical description"
                onChange={onChange}
              />
              <input
                type="text"
                name="note"
                placeholder="Note"
                onChange={onChange}
              />
            </div>
            <div className="fourth-row">
              <textarea
                type="text"
                name="annotation"
                placeholder="Add annotation"
                onChange={onChange}
              />
            </div>
            <div className="fourth-row">
              <textarea
                type="text"
                name="bibliography"
                placeholder="Add bibliography"
                onChange={onChange}
              />
            </div>
            <input
              type="submit"
              name="button"
              value="Enter"
              onClick={onSubmit}
            />
          </form>
        </div>
      </main>
    </>
  );
}

export default NewBookForm;
