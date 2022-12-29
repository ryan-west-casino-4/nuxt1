/**
 *
 */
export default defineNuxtPlugin((nuxtApp) => {
  /**
   *
   */
  const { $axios, env, redirect, router } = nuxtApp;

  /**
   *
   */
  const breeze = $axios.create({
    credentials: true,
    headers: {
      common: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    },
  });

  breeze.setBaseURL(env?.PUBLIC_BACKEND_URL);

  /**
   *
   */
  function handleError422({ error, setErrors }) {
    if (error?.response?.status !== 422) throw error;

    setErrors(Object.values(error?.response?.data?.errors || {}).flat());

    return false;
  }

  /**
   *
   */
  async function revalidate() {
    return await breeze
      .get('/api/user')
      .then((response) => response.data)
      .catch((error) => {
        if (error?.response?.status !== 409) throw error;

        redirect('/verify-email');
      });
  }

  /**
   *
   */
  async function csrf() {
    return await breeze.get('/sanctum/csrf-cookie').catch((error) => {});
  }

  /**
   *
   */
  async function register({ setErrors, ...formData }) {
    await csrf();

    setErrors([]);

    await breeze
      .post('/register', formData)
      .then(() => revalidate())
      .catch((error) => handleError422({ error, setErrors }));
  }

  /**
   *
   */
  async function login({ setErrors, setStatus, setUser, ...formData }) {
    await csrf();

    setStatus(null);
    setErrors([]);

    return await breeze
      .post('/login', formData)
      .then(async (response) => {
        await revalidate();
        return response;
      })
      .then((response) => {
        const { status, ...user } = response.data;
        setUser(user);
        setStatus(status);
        return true;
      })
      .catch((error) => handleError422({ error, setErrors }));
  }

  /**
   *
   */
  async function forgotPassword({ setErrors, setStatus, ...formData }) {
    await csrf();

    setErrors([]);
    setStatus(null);

    await breeze
      .post('/forgot-password', formData)
      .then((response) => {
        setStatus(response.data.status);
      })
      .catch((error) => handleError422({ error, setErrors }));
  }

  /**
   *
   */
  async function resetPassword({ setErrors, setStatus, ...formData }) {
    await csrf();

    setErrors([]);
    setStatus(null);

    await breeze
      .post('/reset-password', {
        token: router.query.token,
        ...formData,
      })
      .then((response) =>
        router.push('/login?reset=' + btoa(response.data.status))
      )
      .catch((error) => handleError422({ error, setErrors }));
  }

  /**
   *
   */
  async function resendEmailVerification({ setStatus }) {
    await breeze.post('/email/verification-notification').then((response) => {
      setStatus(response.data.status);
    });
  }

  /**
   *
   */
  async function logout() {
    await breeze.post('/logout');

    revalidate();
    redirect('/login');
  }

  return {
    provide: {
      breezeRegister: register,
      breezeLogin: login,
      breezeForgotPassword: forgotPassword,
      breezeResetPassword: resetPassword,
      breezeResendEmailVerification: resendEmailVerification,
      breezeLogout: logout,
    },
  };
});
