import { useState } from "react";

type Props = {};

export default function Table({}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  const data = [
    {
      id: 1,
      name: "Cy Ganderton",
      job: "Quality Control Specialist",
      color: "Blue",
    },
    {
      id: 2,
      name: "Hart Hagerty",
      job: "Desktop Support Technician",
      color: "Purple",
    },
    { id: 3, name: "Brice Swyre", job: "Tax Accountant", color: "Red" },
    { id: 4, name: "Jane Doe", job: "Software Engineer", color: "Green" },
    { id: 5, name: "Jane Doe", job: "Software Engineer", color: "Green" },
    { id: 6, name: "Jane Doe", job: "Software Engineer", color: "Green" },
  ];

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="checkbox" />
              </th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id}>
                <th>
                  <input type="checkbox" className="checkbox" />
                </th>
                <td>{row.name}</td>
                <td>{row.job}</td>
                <td>{row.color}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mx-auto text-center my-3.5">
        <div className="join">
          {Array.from({ length: totalPages }, (_, index) => (
            <input
              key={index}
              className={`join-item btn btn-square ${
                currentPage === index + 1 ? "btn-active" : ""
              }`}
              type="radio"
              name="options"
              aria-label={`${index + 1}`}
              onClick={() => handlePageChange(index + 1)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
