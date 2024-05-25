import "./css/tableline.css";

function HeadingTableLine({ heading, del, type }) {
  return (
    <tr>
      <td>
        <input
          type="submit"
          value="-"
          onClick={() => {
            del(heading.uuid);
          }}
        />
      </td>
      {heading.createdAt && <td>{heading.createdAt.split("T")[0]}</td>}
      {type === "author" && (
        <td>{`${heading.name} ${heading.middlename} ${heading.surname}`}</td>
      )}
      {type === "genre" && <td>{heading.genre}</td>}
      {type === "publisher" && <td>{heading.publisher}</td>}
      {type === "section" && <td>{heading.section}</td>}
      {type === "isbn" && <td>{heading.isbn}</td>}
    </tr>
  );
}

export default HeadingTableLine;
