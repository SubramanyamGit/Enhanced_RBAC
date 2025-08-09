// src/hooks/useAuditLogs.js
import { useQuery } from '@tanstack/react-query';
import { axiosInstanceWithToken } from '../api/axiosInstance';

export function useAuditLogs({ page = 1, limit = 10, search = '' }) {
  return useQuery({
    queryKey: ['audit-logs', page, limit, search],
    queryFn: async () => {
      const res = await axiosInstanceWithToken.get('/audit_logs', {
        params: { page, limit, search },
        // tiny cache buster in dev if needed:
        // params: { page, limit, search, _ts: Date.now() },
      });

      // Normalize shape in case backend returns either array or { rows, total, ... }
      const data = res.data;
      if (Array.isArray(data)) {
        return { rows: data, total: data.length, page, limit };
      }
      const { rows = [], total = 0, page: p = page, limit: l = limit } = data || {};
      return { rows, total, page: p, limit: l };
    },
    keepPreviousData: true,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
