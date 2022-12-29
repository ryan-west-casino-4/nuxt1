import { createServer, Model, Response } from 'miragejs';

function error422() {
  return new Response(422, {}, { errors: { email: ['invalid email'] } });
}

export function makeServer({ environment = 'development' } = {}) {
  let server = createServer({
    environment,

    models: {
      user: Model,
    },

    seeds(server) {
      server.create('user', {
        name: 'Bob',
        email: 'user@domain.ltd',
        password: 'aze',
      });
      server.create('user', {
        name: 'Alice',
        email: 'alice@domain.ltd',
        password: 'password',
      });
    },

    routes() {
      this.namespace = '';

      this.get('/api/user', (schema) => {
        return schema.users.all();
      });

      this.get('/sanctum/csrf-cookie', (schema) => {
        return schema.users.all();
      });

      this.post('/register', (schema) => {
        return schema.users.all();
      });

      this.post('/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const users = schema.users.all().models;
        const user = users.find((user) => user.attrs.email === email);

        if (password !== user.attrs.password) {
          return new Response(
            422,
            {},
            { errors: { email: ['invalid email or password'] } }
          );
        }

        return {
          ...user.attrs,
          status: `Logged in as: ${user.attrs.email}`,
        };
      });

      this.post('/forgot-password', (schema, request) => {
        const { email } = JSON.parse(request.requestBody);

        return {
          ...schema.users.find(1).attrs,
          status: `An email as been send to: ${email}`,
        };
      });

      this.post('/reset-password', (schema) => {
        return schema.users.all();
      });

      this.post('/email/verification-notification', (schema) => {
        return schema.users.all();
      });

      this.post('/logout', (schema) => {
        return schema.users.all();
      });
    },
  });

  return server;
}

export default function miragePlugin() {
  console.info('Mirage Plugin');

  if (process.env.NODE_ENV === 'development') {
    console.info('starting Mirage Server');
    makeServer();
  }
}
