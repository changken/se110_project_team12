import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function () {
  const state = useSelector(state => state.oauth);
  const { access_token, username } = state;

  const [repo, setRepo] = useState([]);

  useEffect(async () => {
    const res = await axios.get(
      `https://gitlab.com/api/v4/users/${username}/projects`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    setRepo(res.data);
  }, []);

  return (
    <>
      <h3>Your repo in gitlab:</h3>
      <ul>
        {repo.map((el, i) => (
          <li key={i}>
            {el.name} + {el.web_url}
          </li>
        ))}
      </ul>
    </>
  );
}
