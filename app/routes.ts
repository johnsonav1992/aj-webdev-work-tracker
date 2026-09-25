import { form, get, post, route } from 'remix/routes';

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  auth: {
    login: form('/login'),
    signup: form('/signup'),
    logout: post('/logout'),
    google: {
      start: get('/auth/google'),
      callback: get('/auth/google/callback')
    }
  }
});
