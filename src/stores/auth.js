import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return { user: null };
  },

  actions: {
    setUser(user) {
      this.user = user;
    },

    handleError422({ error, setErrors }) {
      if (error?.response?.status !== 422) throw error;

      setErrors(Object.values(error?.response?.data?.errors || {}).flat());
    },

    async revalidate() {
      return await this.$nuxt.$breeze
        .get('/api/user')
        .then((response) => response.data)
        .catch((error) => {
          if (error?.response?.status !== 409) throw error;

          this.$nuxt.redirect('/verify-email');
        });
    },

    async csrf() {
      return await this.$nuxt.$breeze
        .get('/sanctum/csrf-cookie')
        .catch((error) => {});
    },

    async register({ setErrors, ...formData }) {
      await this.csrf();

      setErrors([]);

      await this.$nuxt.$breeze
        .post('/register', formData)
        .then(() => this.revalidate())
        .catch((error) => this.handleError422({ error, setErrors }));
    },

    async forgotPassword({ setErrors, setStatus, ...formData }) {
      await this.csrf();

      setErrors([]);
      setStatus(null);

      await this.$nuxt.$breeze
        .post('/forgot-password', formData)
        .then((response) => {
          setStatus(response.data.status);
        })
        .catch((error) => this.handleError422({ error, setErrors }));
    },

    async resetPassword({ setErrors, setStatus, ...formData }) {
      await this.csrf();

      setErrors([]);
      setStatus(null);

      await this.$nuxt.$breeze
        .post('/reset-password', {
          token: this.$nuxt.router.query.token,
          ...formData,
        })
        .then((response) =>
          this.$nuxt.router.push('/login?reset=' + btoa(response.data.status))
        )
        .catch((error) => this.handleError422({ error, setErrors }));
    },

    async resendEmailVerification({ setStatus }) {
      await this.$nuxt.$breeze
        .post('/email/verification-notification')
        .then((response) => {
          setStatus(response.data.status);
        });
    },

    async logout() {
      await this.$nuxt.$breeze.post('/logout');

      this.revalidate();
      this.$nuxt.redirect('/login');
    },
  },
});
