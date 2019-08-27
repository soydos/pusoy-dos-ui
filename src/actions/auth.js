export const LOGIN_ACTION = 'LOGIN';
export const HANDLE_LOGIN = 'HANDLE_LOGIN';
export const LOGGED_IN = 'LOGGED_IN';
export const LOGOUT_ACTION = 'LOGOUT';

export const beginLogin = { type: LOGIN_ACTION };
export const login = {type: LOGGED_IN};
export const logout = { type: LOGOUT_ACTION };
export const handleLogin = { type: HANDLE_LOGIN };
