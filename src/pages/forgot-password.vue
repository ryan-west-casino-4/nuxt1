<template>
  <AuthCard>
    <template v-slot:logo>
      <NuxtLink to="/">
        <ApplicationLogo class="w-20 h-20 fill-current text-gray-500" />
      </NuxtLink>
    </template>

    <template v-slot:default>
      <div class="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      <!-- Session Status -->
      <AuthSessionStatus class="mb-4" :status="status" />

      <!-- Validation Errors -->
      <AuthValidationErrors class="mb-4" :errors="errors" />

      <form @submit.prevent="submitForm">
        <!-- Email Address -->
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            class="block mt-1 w-full"
            required
            autoFocus
          />
        </div>

        <div class="flex items-center justify-end mt-4">
          <Button>Email Password Reset Link</Button>
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
const status = ref(null);
const errors = ref([]);

async function submitForm(event) {
  const store = useAuthStore();
  const { email } = event.target.elements;

  await this.$breezeForgotPassword({
    email: email.value,
    setErrors: (newErrors) => (errors.value = newErrors),
    setStatus: (newStatus) => (status.value = newStatus),
  });

  email.value = '';
}
</script>
