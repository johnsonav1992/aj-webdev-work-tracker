import { form, get, post, route } from 'remix/routes';

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  clients: get('/clients'),
  client: get('/clients/:clientId'),
  projects: get('/projects'),
  project: get('/projects/:projectId'),
  projectCreate: form('/projects/new'),
  time: {
    start: post('/time/start'),
    pause: post('/time/pause'),
    resume: post('/time/resume'),
    stop: post('/time/stop')
  },
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
