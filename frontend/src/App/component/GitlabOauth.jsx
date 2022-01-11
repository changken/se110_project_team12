import React, { useEffect } from 'react';
import OAuth2Login from 'react-simple-oauth2-login';
import { useSelector, useDispatch } from 'react-redux';
import ShowGitlabRepo from './ShowGitlabRepo';

function GitlabOauth(props) {
  const state = useSelector(state => state.oauth);

  const onSuccess = response => {
    alert(response);
    //當gitlab oauth success reload page!
    window.location.reload();
  };
  const onFailure = response => console.error(response);

  return (
    <div>
      {state.access_token !== undefined ? (
        // has access token then show below message
        <div style={{ backgroundColor: '#C4C400	', padding: '5px' }}>
          <h2 style={{ color: 'red' }}>You had already login Gitlab!</h2>
          <h3>Your currently login username is {state.username}</h3>
          <ShowGitlabRepo />
        </div>
      ) : (
        // no access token will show oauth login button!
        <OAuth2Login
          authorizationUrl="https://gitlab.com/oauth/authorize"
          responseType="token"
          clientId="1e5a814bb19650202011c7adeff5c65ec2107206137ea58cc9b8da4ae64f5026"
          redirectUri="http://localhost:3001/oauth-callback"
          onSuccess={onSuccess}
          onFailure={onFailure}
          isCrossOrigin={true}
          scope="read_user read_api read_repository"
          id="gitlabLogin"
        >
          <img
            style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
            src="https://about.gitlab.com/images/press/logo/jpg/gitlab-logo-gray-rgb.jpg"
            alt="Gitlab oauth"
          />
        </OAuth2Login>
      )}
    </div>
  );
}

export default GitlabOauth;
