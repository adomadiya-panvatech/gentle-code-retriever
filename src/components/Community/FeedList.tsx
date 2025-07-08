import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as feedService from '../../services/feedService';
import * as reportService from '../../services/reportService';
import { io as socketIOClient } from 'socket.io-client';

const FeedList = ({ communityId }: { communityId: string }) => {
  const { user } = useAuth();
  const [feeds, setFeeds] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [reporting, setReporting] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportError, setReportError] = useState('');

  const fetchFeeds = () => {
    if (user) {
      feedService.getFeeds(communityId, localStorage.getItem('token')!).then(setFeeds);
    }
  };

  useEffect(() => {
    fetchFeeds();
    const socket = socketIOClient('http://localhost:5000');
    socket.on('feedUpdate', (data) => {
      if (data.communityId === communityId) fetchFeeds();
    });
    return () => { socket.disconnect(); };
  }, [user, communityId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await feedService.createFeed(communityId, content, localStorage.getItem('token')!);
      setContent('');
      fetchFeeds();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating feed');
    }
  };

  const handleModerate = async (feedId: string, status: string) => {
    await feedService.moderateFeed(communityId, feedId, status, localStorage.getItem('token')!);
    fetchFeeds();
  };

  const handleDelete = async (feedId: string) => {
    await feedService.deleteFeed(communityId, feedId, localStorage.getItem('token')!);
    fetchFeeds();
  };

  const handleReport = async (feedId: string) => {
    try {
      await reportService.reportFeed(feedId, reportReason, localStorage.getItem('token')!);
      setReporting(null);
      setReportReason('');
      setReportError('');
    } catch (err: any) {
      setReportError(err.response?.data?.message || 'Error reporting feed');
    }
  };

  return (
    <div>
      <h3>Feeds</h3>
      <form onSubmit={handleCreate}>
        <input
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write a post..."
          required
        />
        <button type="submit">Post</button>
      </form>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <ul>
        {feeds.map(feed => (
          <li key={feed.id}>
            {feed.content} [{feed.status}]
            {user?.role === 'admin' && (
              <>
                <button onClick={() => handleModerate(feed.id, 'approved')}>Approve</button>
                <button onClick={() => handleModerate(feed.id, 'rejected')}>Reject</button>
                <button onClick={() => handleDelete(feed.id)}>Delete</button>
              </>
            )}
            {reporting === feed.id ? (
              <form onSubmit={e => { e.preventDefault(); handleReport(feed.id); }}>
                <input value={reportReason} onChange={e => setReportReason(e.target.value)} placeholder="Reason" required />
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setReporting(null)}>Cancel</button>
                {reportError && <div style={{color: 'red'}}>{reportError}</div>}
              </form>
            ) : (
              <button onClick={() => setReporting(feed.id)}>Report</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedList; 