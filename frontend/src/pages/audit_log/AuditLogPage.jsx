import React, { useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { Alert } from 'react-bootstrap';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { useAuth } from '../../context/AuthContext';

const AuditLogPage = () => {
  const { user } = useAuth();
  const canView = user?.permissions?.audit_logs?.includes('view_audit_logs');

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const { data = { rows: [], total: 0, page, limit }, isLoading, error, refetch } =
    useAuditLogs({ page, limit, search });

  const columns = [
    { header: 'Date', accessor: (r) => (r.action_time ? new Date(r.action_time).toLocaleString() : '—') },
    { header: 'User', accessor: (r) => r.user_name || r.user_email || r.user_id || '—' },
    { header: 'Action', accessor: 'action_type' },
    { header: 'Details', accessor: 'action_details' },
  ];

  if (!canView) {
    return <Alert variant="warning" className="m-4">You don’t have permission to view audit logs.</Alert>;
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Audit Logs</h3>
      </div>

      {error ? (
        <Alert variant="danger">Failed to load audit logs.</Alert>
      ) : (
        <CustomTable
          columns={columns}
          data={data.rows}
          isLoading={isLoading}
          itemsPerPage={limit}
          showActions={false}
          serverMode
          totalCount={data.total}
          page={page}
          onPageChange={(p) => setPage(p)}
          onSearchChange={(q) => { setSearch(q); setPage(1); }}
          onRefresh={refetch}
        />
      )}
    </div>
  );
};

export default AuditLogPage;
