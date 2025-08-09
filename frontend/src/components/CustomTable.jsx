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
  showSearch = true,

  // NEW: server-side pagination/search
  serverMode = false,
  totalCount = 0,
  page: controlledPage,
  onPageChange,
  onSearchChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalPage, setInternalPage] = useState(1);

  const page = serverMode && controlledPage ? controlledPage : internalPage;

  // Client-side filter
  const filteredData = useMemo(() => {
    if (serverMode || !searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row ?? {}).some((val) =>
        String(val ?? '').toLowerCase().includes(lower)
      )
    );
  }, [serverMode, searchTerm, data]);

  const clientTotalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const serverTotalPages = Math.max(1, Math.ceil((totalCount || 0) / itemsPerPage));
  const totalPages = serverMode ? serverTotalPages : clientTotalPages;

  const paginatedData = useMemo(() => {
    if (serverMode) return data; // already sliced by server
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [serverMode, page, filteredData, itemsPerPage, data]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    if (serverMode) {
      onSearchChange?.(val);
      onPageChange?.(1);
    } else {
      setInternalPage(1);
    }
  };

  const gotoPage = (p) => {
    if (serverMode) onPageChange?.(p);
    else setInternalPage(p);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <Pagination.Item key={i} active={i === page} onClick={() => gotoPage(i)}>
            {i}
          </Pagination.Item>
        );
      }
      return <Pagination className="mt-3 justify-content-end">{items}</Pagination>;
    }

    items.push(
      <Pagination.Prev key="prev" disabled={page === 1} onClick={() => gotoPage(Math.max(1, page - 1))} />
    );

    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + 2);
    if (end - start < 2) start = Math.max(1, end - 2);

    for (let i = start; i <= end; i++) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => gotoPage(i)}>
          {i}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next key="next" disabled={page === totalPages} onClick={() => gotoPage(Math.min(totalPages, page + 1))} />
    );

    return <Pagination className="mt-3 justify-content-end">{items}</Pagination>;
  };

  const colSpan = columns.length + (showActions && (showEdit || showDelete) ? 1 : 0);

  return (
    <div className="table-responsive">
      {showSearch && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={serverMode ? undefined : searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ maxWidth: '250px' }}
          />
        </div>
      )}

      <Table bordered hover striped className="align-middle text-start shadow-sm">
        <thead className="table-primary">
          <tr>
            {columns.map((c, i) => (
              <th key={i} className={c.className || ''}>{c.header}</th>
            ))}
            {showActions && (showEdit || showDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={colSpan || 1} className="text-center py-4">
                <Spinner animation="border" size="sm" className="me-2" />
                Loading...
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={colSpan || 1} className="text-center text-muted py-4">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rIdx) => (
              <tr key={rIdx}>
                {columns.map((c, cIdx) => {
                  const v = typeof c.accessor === 'function' ? c.accessor(row) : row[c.accessor];
                  return <td key={cIdx}>{v}</td>;
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
