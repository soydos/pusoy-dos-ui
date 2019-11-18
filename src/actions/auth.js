export const LOGIN_ACTION = 'LOGIN';
export const HANDLE_LOGIN = 'HANDLE_LOGIN';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGOUT_ACTION = 'LOGOUT';

export const REDEEM_TOKEN = 'REDEEM_TOKEN';
export const COMPLETE_LOGIN = 'COMPLETE_LOGIN';

export const beginLogin = { type: LOGIN_ACTION };
export const login = (accessToken) => (
    {type: LOGGED_IN, accessToken}
);
export const logout = { type: LOGOUT_ACTION };
export const handleLogin = { type: HANDLE_LOGIN };
