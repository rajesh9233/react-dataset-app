import React, { useEffect, useState } from "react";
import { useTable, useSortBy } from "react-table";
import axios from "axios";
import "./RecipeTable.css";

const API_URL =
  "https://s3-ap-southeast-1.amazonaws.com/he-public-data/reciped9d7b8c.json";
const RecipeTable = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Category",
        accessor: "category",
        sortType: "basic",
      },
      {
        Header: "Name",
        accessor: "name",
        sortType: "basic",
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ cell }) => (
          <input
            type="text"
            value={cell.value}
            onChange={(e) => {
              const value = e.target.value;
              cell.row.original.price = value;
              setData([...data]);
            }}
          />
        ),
      },
    ],
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setData(response.data);
        setOriginalData(response.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = () => {
    // Save the edited price values to localStorage
    localStorage.setItem("editedPrices", JSON.stringify(data));
  };

  const handleReset = () => {
    // Reset the price values to the original data
    setData(originalData);
  };

  return (
    <div className="recipe-table-container">
      <div className="button-container">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      </div>
      <table {...getTableProps()} className="recipe-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ cursor: "pointer" }}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeTable;
