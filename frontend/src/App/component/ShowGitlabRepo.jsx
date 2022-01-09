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
            key={i}
            style={{
              backgroundColor: '#00ccaa',
              padding: '10px',
              marginBottom: '5px',
            }}
          >
            {el.name} <br />
            {el.web_url} <br />
            <Link to={`/gitlabcommits/${el.id}`}>commits</Link>&nbsp;
            <Link to={`/gitlabissues/${el.id}`}>issues</Link>&nbsp;
            <Link to={`/gitlabcodebase/${el.id}`}>codebase</Link>
          </li>
        ))}
      </ul>
    </ErrorBoundary>
  );
}
