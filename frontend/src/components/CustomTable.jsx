import React, { useState, useMemo } from 'react';
import { Table, Spinner, Form, Pagination, Button } from 'react-bootstrap';
import { Pencil, Trash } from 'react-bootstrap-icons';

export default function CustomTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No data available',
  itemsPerPage = 5,
  onEdit = () => {},
  onDelete = () => {},
  showActions = false,
  showEdit = true,
  showDelete = true,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [searchTerm, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [page, filteredData, itemsPerPage]);

const renderPagination = () => {
  if (totalPages <= 1) return null;

  const paginationItems = [];

  // If 3 or fewer pages, show page numbers only (no arrows)
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return <Pagination className="mt-3 justify-content-end">{paginationItems}</Pagination>;
  }

  // More than 3 pages: show arrows + sliding window
  paginationItems.push(
    <Pagination.Prev
      key="prev"
      disabled={page === 1}
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    />
  );

  let start = Math.max(1, page - 1);
  let end = Math.min(totalPages, start + 2);

  if (end - start < 2) {
    start = Math.max(1, end - 2);
  }

  for (let i = start; i <= end; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
        {i}
      </Pagination.Item>
    );
  }

  paginationItems.push(
    <Pagination.Next
      key="next"
      disabled={page === totalPages}
      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    />
  );

  return <Pagination className="mt-3 justify-content-end">{paginationItems}</Pagination>;
};



  return (
    <div className="table-responsive">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: '250px' }}
        />
      </div>

      <Table bordered hover striped className="align-middle text-start shadow-sm">
        <thead className="table-primary">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className || ''}>
                {col.header}
              </th>
            ))}
            {showActions && (showEdit || showDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4">
                <Spinner animation="border" size="sm" className="me-2" />
                Loading...
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-muted py-4">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => {
                  const value =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : row[col.accessor];
                  return <td key={colIndex}>{value}</td>;
                })}
                {showActions && (showEdit || showDelete) && (
                  <td>
                    {showEdit && (
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(row)}>
                        <Pencil size={16} />
                      </Button>
                    )}
                    {showDelete && (
                      <Button variant="outline-danger" size="sm" onClick={() => onDelete(row)}>
                        <Trash size={16} />
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {renderPagination()}
    </div>
  );
}
