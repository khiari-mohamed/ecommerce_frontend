"use client";
import React, { useEffect, useState } from "react";
import { fetchRecentActivity } from "../../utils/fetchDashboardData";

interface ActivityItem {
  user: string;
  action: string;
  time: string | number | Date;
}

export default function RecentActivity({ limit = 10 }) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentActivity(limit).then((data) => {
      setActivity(data);
      setLoading(false);
    });
  }, [limit]);

  if (loading) return <div>Loading activity...</div>;

  return (
    <div className="dashboard-activity-list">
      {activity.map((item, idx) => (
        <div key={idx} className="dashboard-activity-item">
          <span className="dashboard-activity-user">{item.user}</span>
          <span className="dashboard-activity-action">{item.action}</span>
          <span className="dashboard-activity-time">
            {new Date(item.time).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
