const initState = {
  access_token: localStorage.getItem('access_token') || undefined,
  username: localStorage.getItem('username') || undefined,
};

function oauthReducer(state = initState, action) {
  const { type, payload } = action;
  switch (type) {
    case 'OAUTH_LOGIN':
      localStorage.setItem('access_token', payload.access_token);
      return { ...state, ...payload };
    case 'GET_USERNAME':
      localStorage.setItem('username', payload.username);
      return { ...state, ...payload };
    case 'OAUTH_LOGOUT':
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      return { ...state, access_token: undefined, username: undefined };
    default:
      return state;
  }
}

export default oauthReducer;
