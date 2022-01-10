import { oauthLogin, getUsername, oauthLogout } from '.';

test('test oauthLogin', () => {
  const access_token =
    '1295111111307605abe0a49511111111116480c3d454940b8e8c000000d27624';
  expect(oauthLogin(access_token)).toEqual({
    type: 'OAUTH_LOGIN',
    payload: {
      access_token:
        '1295111111307605abe0a49511111111116480c3d454940b8e8c000000d27624',
    },
  });
});

test('test username', () => {
  const username = 'cwoo';
  expect(getUsername(username)).toEqual({
    type: 'GET_USERNAME',
    payload: {
      username: 'cwoo',
    },
  });
});

test('test oauthLogout', () => {
  expect(oauthLogout()).toEqual({
    type: 'OAUTH_LOGOUT',
  });
});
