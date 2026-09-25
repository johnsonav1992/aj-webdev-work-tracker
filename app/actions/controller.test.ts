import * as assert from 'remix/assert';
import { describe, it } from 'remix/test';

import { router } from '../router.ts';
import { routes } from '../routes.ts';

describe('root controller', () => {
  it('redirects anonymous requests to the login page', async () => {
    const response = await router.fetch(new URL(routes.home.href(), 'http://localhost'));

    assert.equal(response.status, 303);
    assert.equal(response.headers.get('Location'), 'http://localhost/login');
  });

  it('renders the sign-in page with a CSRF token', async () => {
    const response = await router.fetch(
      new URL(routes.auth.login.index.href(), 'http://localhost')
    );

    assert.equal(response.status, 200);
    assert.match(response.headers.get('Content-Type') ?? '', /text\/html/);
    assert.match(await response.text(), /name="_csrf"/);
  });
});
