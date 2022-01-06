import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { getUsername, oauthLogin } from '../../redux/action';

function GitlabOauthRedirect(props) {
  const dispatch = useDispatch();
  const state = useSelector(state => state.oauth);

  useEffect(async () => {
    const access_token = window.location.hash.split('&')[0].split('=')[1];
    dispatch(oauthLogin(access_token));

    const res = await axios.get('https://gitlab.com/api/v4/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    dispatch(getUsername(res.data.username));
  }, []);
  return (
    <div>
      <h2>Redirect url here!</h2>
      <h2>access token: {state.access_token}</h2>
    </div>
  );
}

export default GitlabOauthRedirect;
