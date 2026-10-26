import React from "react";

function DataTable({ columns = [], data = [], emptyMessage = "No records found." }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left border-collapse text-sm text-gray-700">
        <thead className="bg-gray-50 border-b border-gray-200 uppercase text-xs font-semibold text-gray-600 tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-3.5 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-gray-50/80 transition-colors">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={`px-4 py-3.5 whitespace-nowrap text-gray-900 ${col.cellClassName || ""}`}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
