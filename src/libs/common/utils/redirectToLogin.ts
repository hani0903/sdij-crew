export const redirectToLogin = () => {
    window.dispatchEvent(new Event('auth:unauthorized'));
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.replace('/login');
};
