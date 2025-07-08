import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as adminReportService from '../../services/adminReportService';

const PAGE_SIZE = 10;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [filters, setFilters] = useState({ status: '', feedId: '', userId: '' });
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(0);
  const [modalReport, setModalReport] = useState<any | null>(null);

  const fetchReports = () => {
    if (user?.role === 'admin') {
      adminReportService.getReports(
        localStorage.getItem('token')!,
        { ...filters, sort, order, limit: PAGE_SIZE, offset: page * PAGE_SIZE }
      ).then(setReports);
    }
  };

  useEffect(() => { fetchReports(); }, [user, filters, sort, order, page]);

  const handleStatusChange = async (reportId: string, status: string) => {
    await adminReportService.updateReportStatus(reportId, status, localStorage.getItem('token')!);
    fetchReports();
  };

  const handleBulkStatusChange = async (status: string) => {
    await Promise.all(selectedReports.map(id =>
      adminReportService.updateReportStatus(id, status, localStorage.getItem('token')!)
    ));
    setSelectedReports([]);
    fetchReports();
  };

  const handleSelect = (id: string) => {
    setSelectedReports(selectedReports.includes(id)
      ? selectedReports.filter(rid => rid !== id)
      : [...selectedReports, id]);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(0); // Reset to first page on filter change
  };

  if (user?.role !== 'admin') return null;

  return (
    <div>
      <h2>Admin Dashboard: Reports</h2>
      <div>
        <input name="feedId" value={filters.feedId} onChange={handleFilterChange} placeholder="Feed ID" />
        <input name="userId" value={filters.userId} onChange={handleFilterChange} placeholder="User ID" />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="reviewed">Reviewed</option>
          <option value="dismissed">Dismissed</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="createdAt">Date</option>
          <option value="status">Status</option>
        </select>
        <select value={order} onChange={e => setOrder(e.target.value as 'ASC' | 'DESC')}>
          <option value="DESC">Desc</option>
          <option value="ASC">Asc</option>
        </select>
        <button onClick={fetchReports}>Filter</button>
      </div>
      {selectedReports.length > 0 && (
        <div>
          <button onClick={() => handleBulkStatusChange('reviewed')}>Mark Selected Reviewed</button>
          <button onClick={() => handleBulkStatusChange('dismissed')}>Dismiss Selected</button>
        </div>
      )}
      <ul>
        {reports.map(r => (
          <li key={r.id}>
            <input
              type="checkbox"
              checked={selectedReports.includes(r.id)}
              onChange={() => handleSelect(r.id)}
            />
            <span onClick={() => setModalReport(r)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              Feed ID: {r.feedId}, User ID: {r.userId}, Reason: {r.reason}, Status: {r.status}
            </span>
            <button onClick={() => handleStatusChange(r.id, 'reviewed')}>Mark Reviewed</button>
            <button onClick={() => handleStatusChange(r.id, 'dismissed')}>Dismiss</button>
          </li>
        ))}
      </ul>
      <div>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {modalReport && (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: '#fff', margin: '10% auto', padding: 20, maxWidth: 500 }}>
            <h3>Report Details</h3>
            <pre>{JSON.stringify(modalReport, null, 2)}</pre>
            <button onClick={() => setModalReport(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 