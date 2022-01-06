export function oauthLogin(access_token) {
  return {
    type: 'OAUTH_LOGIN',
    payload: {
      access_token,
    },
  };
}

export function getUsername(username) {
  return {
    type: 'GET_USERNAME',
    payload: {
      username,
    },
  };
}
