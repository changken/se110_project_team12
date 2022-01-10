import oauthReducer from './oauthReducer';
import { getUsername, oauthLogin, oauthLogout } from '../action';

test('test oauthReducer', () => {
  let unknownFunction = some => ({ type: 'gokrgjko', payload: { some } });
  let action = unknownFunction('swfcmiwji');
  let state = oauthReducer({ access_token: undefined }, action);

  expect(state).toEqual({
    access_token: undefined,
  });
});

test('test oauthReducer', () => {
  let action = oauthLogin(
    '1295111111307605abe0a49511111111116480c3d454940b8e8c000000d27624'
  );
  let state = oauthReducer({ access_token: undefined }, action);

  expect(state).toEqual({
    access_token:
      '1295111111307605abe0a49511111111116480c3d454940b8e8c000000d27624',
  });
});

test('test oauthReducer', () => {
  let action = getUsername('cwoo');
  let state = oauthReducer({ username: undefined }, action);

  expect(state).toEqual({
    username: 'cwoo',
  });
});

test('test oauthLogout', () => {
  let action = oauthLogout();
  let state = oauthReducer(
    {
      access_token:
        '1295111111307605abe0a49511111111116480c3d454940b8e8c000000d27624',
      username: 'cwoo',
    },
    action
  );
  expect(state).toEqual({
    access_token: undefined,
    username: undefined,
  });
});
