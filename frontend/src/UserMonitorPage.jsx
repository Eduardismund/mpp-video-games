import React, { useEffect, useState } from "react";

function UserMonitorPage() {
  const [userMonitorList, setUserMonitorList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLoaded(false);
    }, 10_000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/user-monitors", {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      if (res.ok) {
        const { items } = await res.json();
        setUserMonitorList([...items]);
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

  return (
    <>
      {!loaded ? (
        <p>Loading...</p>
      ) : userMonitorList.length === 0 ? (
        <div className="no-results">No monitored users</div>
      ) : (
        <table>
          <thead>
          <tr>
            <th>Username</th>
            <th>Reason</th>
            <th>First Seen</th>
            <th>Last Seen</th>
          </tr>
          </thead>
          <tbody>
          {userMonitorList.map((item, index) => (
            <tr key={index}>
              <td>{item.username}</td>
              <td>{item.reason}</td>
              <td>{formatTimestamp(item.timestampFirst)}</td>
              <td>{formatTimestamp(item.timestampLast)}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default UserMonitorPage;
