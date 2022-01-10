import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { oauthLogout } from '../../redux/action';
import ErrorBoundary from './ErrorBoundary';
import { Link } from 'react-router-dom';

export default function () {
  const dispatch = useDispatch();
  const state = useSelector(state => state.oauth);
  const { access_token, username } = state;

  const [repo, setRepo] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        //https://docs.gitlab.com/ee/api/projects.html#list-user-projects
        const res = await axios.get(
          `https://gitlab.com/api/v4/users/${username}/projects`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        setRepo(res.data);
      } catch (error) {
        dispatch(oauthLogout());
      }
    }
    fetchProjects();
  }, []);

  return (
    <ErrorBoundary>
      <h3>Your repo in gitlab:</h3>
      <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
        {repo.map((el, i) => (
          <li
            id={el.id}
            key={i}
            style={{
              backgroundColor: '#00ccaa',
              padding: '10px',
              marginBottom: '5px',
              borderRadius: '5px',
            }}
          >
            <Link
              to={`/gitlabcommits/${el.id}`}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: '#000',
              }}
            >
              {el.name} <br />
              {el.web_url}
            </Link>
          </li>
        ))}
      </ul>
    </ErrorBoundary>
  );
}
