import React, { useEffect, useState } from "react";

function ActiveUserSessionsPage() {
  const [tokenMonitorList, setTokenMonitorList] = useState([]);
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/active-user-sessions", {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      if (res.ok) {
        const { items } = await res.json();
        setTokenMonitorList([...items]);
        setLoaded(true);
      }
    }
    fetchData();
  }, [loaded]);

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const sec = String(date.getSeconds()).padStart(2, "0");
    return `${year} ${hour}:${min}:${sec}`;
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/active-user-sessions/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: sessionStorage.getItem("token"),
      },
    });

    if (res.ok) {
      setLoaded(false);
    } else {
      console.error("Failed to invalidate token");
    }
  };

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : tokenMonitorList.length === 0 ? (
        <div className="no-results">No active tokens corresponding to users</div>
      ) : (
        <table>
          <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Valid Before</th>
            <th>End Session</th>
          </tr>
          </thead>
          <tbody>
          {tokenMonitorList.map((item, index) => (
            <tr key={index}>
              <td>{item.username}</td>
              <td>Active</td>
              <td>{formatTimestamp(item.validBefore)}</td>
              <td>
                <button onClick={() => handleDelete(item.id)}>
                  End Session
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default ActiveUserSessionsPage;
