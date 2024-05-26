import HeadingTableLine from "../components/HeadingTableLine";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, redirect, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { setPage, setFlexData } from "../features/search/searchSlice";
import {
  getAuthors,
  getGenres,
  getPublishers,
  getSections,
  getIsbns,
  createAuthor,
  createGenre,
  createSection,
  createPublisher,
  createIsbn,
  deleteAuthor,
  deleteGenre,
  deleteSection,
  deletePublisher,
  deleteIsbn,
  resetHeadings,
} from "../features/headings/headingSlice";

function HeadingsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, roles } = useSelector((state) => state.auth);
  const {
    authors,
    genres,
    publishers,
    sections,
    isbns,
    isSuccess,
    isError,
    message,
    isLoading,
  } = useSelector((state) => state.headings);
  const { flexData, page, limit, sort } = useSelector((state) => state.search);
  const [keyPressed, setKeyCounter] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [headingType, setHeadingType] = useState("author");
  const [loadedData, setLoaded] = useState([]);

  const [headingData, setHeadingData] = useState("");

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

    if (headingType === "author")
      dispatch(
        getAuthors({
          query: flexData,
          limit: limit,
          offset: offset,
        })
      );
    if (headingType === "genre")
      dispatch(
        getGenres({
          query: flexData,
          limit: limit,
          offset: offset,
        })
      );
    if (headingType === "section")
      dispatch(
        getSections({
          query: flexData,
          limit: limit,
          offset: offset,
        })
      );
    if (headingType === "publisher")
      dispatch(
        getPublishers({
          query: flexData,
          limit: limit,
          offset: offset,
        })
      );
    if (headingType === "isbn")
      dispatch(
        getIsbns({
          query: flexData,
          limit: limit,
          offset: offset,
        })
      );

    return () => {
      dispatch(resetHeadings());
    };
  }, [
    keyPressed,
    page,
    limit,
    headingType,
    flexData,
    navigate,
    isError,
    message,
    dispatch,
  ]);

  useEffect(() => {
    if (headingType === "author") setLoaded(authors);
    if (headingType === "genre") setLoaded(genres);
    if (headingType === "section") setLoaded(sections);
    if (headingType === "publisher") setLoaded(publishers);
    if (headingType === "isbn") setLoaded(isbns);
  }, [isSuccess]);
  if (isLoading) {
    return <Spinner />;
  }

  const delHeading = async (query) => {
    if (window.confirm("Do you really want to delete this heading?")) {
      if (headingType === "author") {
        await dispatch(deleteAuthor(query));
        setKeyCounter(keyPressed + 1);
      }
      if (headingType === "genre") {
        await dispatch(deleteGenre(query));
        setKeyCounter(keyPressed + 1);
      }
      if (headingType === "section") {
        await dispatch(deleteSection(query));
        setKeyCounter(keyPressed + 1);
      }
      if (headingType === "publisher") {
        await dispatch(deletePublisher(query));
        setKeyCounter(keyPressed + 1);
      }
      if (headingType === "isbn") {
        await dispatch(deleteIsbn(query));
        setKeyCounter(keyPressed + 1);
      }
    }
  };

  const addHeading = async () => {
    if (headingType === "author") {
      let x = headingData.split(" ").filter((y) => y !== "" || y !== " ");
      let d = { name: "_", middlename: "_", surname: "_" };
      if (x.length === 0) d = { name: "_", middlename: "_", surname: "_" };
      if (x.length === 1) d = { name: x[0], middlename: "_", surname: "_" };
      if (x.length === 2) d = { name: x[0], middlename: "_", surname: x[1] };
      if (x.length === 3) d = { name: x[0], middlename: x[2], surname: x[1] };
      if (x.length > 3)
        d = { name: x.join(" "), middlename: "_", surname: "_" };
      await dispatch(createAuthor(d));
      setKeyCounter(keyPressed + 1);
    }
    if (headingType === "genre") {
      await dispatch(createGenre({ genre: headingData }));
      setKeyCounter(keyPressed + 1);
    }
    if (headingType === "section") {
      await dispatch(createSection({ section: headingData }));
      setKeyCounter(keyPressed + 1);
    }
    if (headingType === "publisher") {
      await dispatch(createPublisher({ publisher: headingData }));
      setKeyCounter(keyPressed + 1);
    }
    if (headingType === "isbn") {
      await dispatch(createIsbn({ isbn: headingData }));
      setKeyCounter(keyPressed + 1);
    }
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
            if (loadedData.length == limit) {
              dispatch(setPage(page + 1));
            }
          }}
        >
          ➡
        </div>
        &nbsp;&nbsp;&nbsp;
        <select
          onChange={(e) => {
            setHeadingType(e.target.value);
            dispatch(setPage(1));
            dispatch(setFlexData("_"));
          }}
        >
          <option value={"author"}>type</option>
          <option value={"author"}>author</option>
          <option value={"genre"}>genre</option>
          <option value={"publisher"}>publisher</option>
          <option value={"section"}>section</option>
          <option value={"isbn"}>isbn</option>
        </select>
        &nbsp;&nbsp;&nbsp;
        <input
          type="text"
          name="heading"
          placeholder="Heading"
          style={{ width: "300px" }}
          onChange={(e) => setHeadingData(e.target.value)}
          maxLength={120}
        />
        <input
          type="button"
          value="Add"
          onClick={(e) => {
            e.preventDefault();
            addHeading();
          }}
        />
      </div>
      <main>
        <div className="table-box">
          <h5>
            {loadedData.length} {headingType}s in list
          </h5>
          <div className="debt-list">
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Heading</th>
                </tr>
                {headingType === "author" &&
                  authors &&
                  authors.map((author) => (
                    <HeadingTableLine
                      heading={author}
                      type={headingType}
                      del={delHeading}
                      key={author.uuid}
                    />
                  ))}
                {headingType === "genre" &&
                  genres &&
                  genres.map((genre) => (
                    <HeadingTableLine
                      heading={genre}
                      type={headingType}
                      del={delHeading}
                      key={genre.uuid}
                    />
                  ))}
                {headingType === "publisher" &&
                  publishers &&
                  publishers.map((publisher) => (
                    <HeadingTableLine
                      heading={publisher}
                      type={headingType}
                      del={delHeading}
                      key={publisher.uuid}
                    />
                  ))}
                {headingType === "section" &&
                  sections &&
                  sections.map((section) => (
                    <HeadingTableLine
                      heading={section}
                      type={headingType}
                      del={delHeading}
                      key={section.uuid}
                    />
                  ))}
                {headingType === "isbn" &&
                  isbns &&
                  isbns.map((isbn) => (
                    <HeadingTableLine
                      heading={isbn}
                      type={headingType}
                      del={delHeading}
                      key={isbn.uuid}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default HeadingsList;
