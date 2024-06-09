import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./css/newbook.css";
import CreatableSelect from "react-select/creatable";
import {
  getAuthors,
  getGenres,
  getPublishers,
  getSections,
  resetHeadings,
} from "../features/headings/headingSlice";
import { oneBook, updBook } from "../features/book/bookSlice";
import { toast } from "react-toastify";

function EditBook() {
  const { uuid } = useParams();

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

  const { authors, genres, publishers, sections, isError, message } =
    useSelector((state) => state.headings);
  const { user, roles } = useSelector((state) => state.auth);
  const bookState = useSelector((state) => state.books);
  const { book } = bookState;

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

    dispatch(oneBook(uuid));

    return () => {
      dispatch(resetHeadings());
    };
  }, [isError, message, navigate, dispatch]);

  useEffect(() => {
    setFormData({
      title: book.title,
      originalTitle: book.originalTitle,
      yearPublish: book.yearPublish,
      yearAuthor: book.yearAuthor,
      bibliography: book.bibliography,
      annotation: book.annotation,
      physicalDescription: book.physicalDescription,
      note: book.note,
      udk: book.udk,
      bbk: book.bbk,
      number: book.number,
      rate: book.rate,
      genre: book.genres,
      author: book.authors,
      section: book.section,
      publisher: book.publisher,
      isbn: book.isbns,
    });
  }, [bookState.isSuccess]);

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
          return { name: x[0], middlename: x[1], surname: x[2] };
        if (x.length > 3)
          return { name: x.join(" "), middlename: "_", surname: "_" };
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

    const bookData = await replaceEmpty();

    const isValid = await validateForm(bookData);
    if (isValid === "Ok") {
      await dispatch(resetHeadings());
      await dispatch(updBook({ uuid: uuid, obj: bookData }));
      await navigate(`/book/${uuid}`);
    } else {
      toast.error(`There is an error in ${isValid}`, {
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
  };

  const validateForm = async (obj) => {
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
      authors: author,
      genres: genre,
      section,
      publisher,
      isbns: isbn,
    } = obj;

    const authorValid = author.filter(
      (x) =>
        x.name.length > 200 ||
        x.surname.length > 200 ||
        x.middlename.length > 200
    );
    const genreValid = genre.filter((x) => x.genre.length > 200);
    const isbnValid = isbn.filter((x) => x.isbn.length > 13);
    const sectionValid = section.section.length > 200;
    const publisherValid = publisher.publisher.length > 200;
    const rateMatch = rate.toString().match(/^(\d(\.|,)\d{1,2})$|^(\d)$/);
    if (yearPublish < 1000 || yearPublish > 2100) return "Year by Publiser";
    if (yearAuthor < 1000 || yearAuthor > 2100) return "Year by Author";
    if (number < 0 || number > 100) return "Number";
    if (!rateMatch || rate < 0 || rate > 5) return "Rate";
    if (authorValid.length > 0) return "Authors";
    if (genreValid.length > 0) return "Genres";
    if (isbnValid.length > 0) return "ISBN";
    if (sectionValid) return "Section";
    if (publisherValid) return "Publisher";
    return "Ok";
  };

  const replaceEmpty = async () => {
    const newtitle = title || "_";
    const neworiginalTitle = originalTitle || "_";
    const newyearPublish = yearPublish || "_";
    const newyearAuthor = yearAuthor || "_";
    const newbibliography = bibliography || "_";
    const newannotation = annotation || "_";
    const newphysicalDescription = physicalDescription || "_";
    const newnote = note || "_";
    const newudk = udk || "_";
    const newbbk = bbk || "_";
    const newnumber = number || 1;
    const newrate = rate || 0;
    const newgenre =
      genre.length > 0
        ? genre
        : [
            {
              genre: "_",
            },
          ];
    const newauthor =
      author.length > 0
        ? author
        : [
            {
              name: "_",
              surname: "_",
              middlename: "_",
            },
          ];
    const newsection = section.section
      ? section
      : {
          section: "_",
        };
    const newpublisher = publisher.publisher
      ? publisher
      : {
          publisher: "_",
        };
    const newisbn =
      isbn.length > 0
        ? isbn
        : [
            {
              isbn: "_",
            },
          ];
    return {
      title: newtitle,
      originalTitle: neworiginalTitle,
      yearPublish: newyearPublish,
      yearAuthor: newyearAuthor,
      bibliography: newbibliography,
      annotation: newannotation,
      physicalDescription: newphysicalDescription,
      note: newnote,
      udk: newudk,
      bbk: newbbk,
      number: newnumber,
      rate: newrate,
      authors: newauthor,
      genres: newgenre,
      section: newsection,
      publisher: newpublisher,
      isbns: newisbn,
    };
  };

  return (
    <>
      {bookState.isSuccess && (
        <main>
          <div className="form-box" id="create-book-box">
            <h4>Edit the Book</h4>
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
                  defaultValue={book.title}
                  onChange={onChange}
                  maxLength={250}
                />
                <input
                  type="number"
                  name="yearAuthor"
                  placeholder="Year by Author"
                  defaultValue={book.yearAuthor}
                  maxLength={4}
                  max={2100}
                  min={1000}
                  onChange={onChange}
                />
              </div>
              <div className="first-row">
                <input
                  type="text"
                  name="originalTitle"
                  placeholder="Enter original title"
                  defaultValue={book.originalTitle}
                  maxLength={250}
                  onChange={onChange}
                />
                <input
                  type="number"
                  name="yearPublish"
                  placeholder="Year by Publisher"
                  defaultValue={book.yearPublish}
                  maxLength={4}
                  max={2100}
                  min={1000}
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
                  defaultValue={book.authors.map((x) => ({
                    value: {
                      name: x.name,
                      surname: x.surname,
                      middlename: x.middlename,
                    },
                    label: `${x.name} ${x.middlename} ${x.surname}`,
                  }))}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  maxLength={200}
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
                  maxLength={200}
                  defaultValue={book.genres.map((x) => ({
                    value: x.genre,
                    label: x.genre,
                  }))}
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
                  defaultValue={{
                    value: book.publisher ? book.publisher.publisher : "_",
                    label: book.publisher ? book.publisher.publisher : "_",
                  }}
                  onMenuOpen={() =>
                    dispatch(
                      getPublishers({ query: "_", limit: 3000, offset: 0 })
                    )
                  }
                  onMenuClose={() => dispatch(resetHeadings())}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  maxLength={200}
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
                    dispatch(
                      getSections({ query: "_", limit: 3000, offset: 0 })
                    )
                  }
                  onMenuClose={() => dispatch(resetHeadings())}
                  defaultValue={{
                    value: book.section ? book.section.section : "_",
                    label: book.section ? book.section.section : "_",
                  }}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  maxLength={200}
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
                  maxLength={100}
                  defaultValue={book.bbk}
                />
                <input
                  type="text"
                  name="udk"
                  placeholder="UDK"
                  onChange={onChange}
                  maxLength={100}
                  defaultValue={book.udk}
                />
                <CreatableSelect
                  placeholder="ISBN"
                  isMulti
                  // options={isbnOptions}
                  onChange={onSelectChangeIsbns}
                  defaultValue={book.isbns.map((x) => ({
                    value: x.isbn,
                    label: x.isbn,
                  }))}
                  maxLength={13}
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
                  type="number"
                  name="number"
                  placeholder="Number"
                  onChange={onChange}
                  maxLength={2}
                  max={99}
                  min={0}
                  defaultValue={book.number}
                />
                <input
                  type="number"
                  name="rate"
                  placeholder="Rate"
                  onChange={onChange}
                  maxLength={3}
                  max={5}
                  min={0}
                  step="0.1"
                  pattern="\d\.\d"
                  title="Format: 2.5"
                  defaultValue={book.rate}
                />
                <input
                  type="text"
                  name="physicalDescription"
                  placeholder="Physical description"
                  onChange={onChange}
                  maxLength={200}
                  defaultValue={book.physicalDescription}
                />
                <input
                  type="text"
                  name="note"
                  placeholder="Note"
                  onChange={onChange}
                  maxLength={200}
                  defaultValue={book.note}
                />
              </div>
              <div className="fourth-row">
                <textarea
                  type="text"
                  name="annotation"
                  placeholder="Add annotation"
                  onChange={onChange}
                  defaultValue={book.annotation}
                />
              </div>
              <div className="fourth-row">
                <textarea
                  type="text"
                  name="bibliography"
                  placeholder="Add bibliography"
                  onChange={onChange}
                  defaultValue={book.bibliography}
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
      )}
    </>
  );
}

export default EditBook;
