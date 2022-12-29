<template>
  <AuthCard>
    <template v-slot:logo>
      <NuxtLink to="/">
        <ApplicationLogo class="w-20 h-20 fill-current text-gray-500" />
      </NuxtLink>
    </template>

    <template v-slot:default>
      <!-- Session Status -->
      <AuthSessionStatus class="mb-4" :status="status" />

      <!-- Validation Errors -->
      <AuthValidationErrors class="mb-4" :errors="errors" />

      <form @submit.prevent="submitForm">
        <!-- Email Address -->
        <div>
          <Label for="email">Email</Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@domain.tld"
            class="block mt-1 w-full"
            required
            autofocus
          />
        </div>

        <!-- Password -->
        <div class="mt-4">
          <Label for="password">Password</Label>

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            class="block mt-1 w-full"
            required
            autoComplete="current-password"
          />
        </div>

        <!-- Remember Me -->
        <div class="block mt-4">
          <label for="remember_me" class="inline-flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              name="remember_me"
              class="
                rounded
                border-gray-300
                text-indigo-600
                shadow-sm
                focus:border-indigo-300
                focus:ring
                focus:ring-indigo-200
                focus:ring-opacity-50
              "
            />

            <span class="ml-2 text-sm text-gray-600"> Remember me </span>
          </label>
        </div>

        <div class="flex items-center justify-end mt-4">
          <NuxtLink
            to="/forgot-password"
            class="underline text-sm text-gray-600 hover:text-gray-900"
          >
            Forgot your password?
          </NuxtLink>

          <Button class="ml-3">Login</Button>
        </div>
      </form>
    </template>
  </AuthCard>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
/*
definePageMeta({
  layout: 'guest',
});
*/
const status = ref('');
const errors = ref([]);

async function submitForm(event) {
  const { setUser } = useAuthStore();
  const { email, password } = event.target.elements;

  const isSuccess = await this.$breezeLogin({
    email: email.value,
    password: password.value,
    setErrors: (newErrors) => (errors.value = newErrors),
    setStatus: (newStatus) => (status.value = newStatus),
    setUser,
  });

  if (isSuccess) {
    email.value = '';
  }
  password.value = '';
}
</script>
