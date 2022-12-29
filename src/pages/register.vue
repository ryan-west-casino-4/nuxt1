<template>
  <AuthCard>
    <template v-slot:logo>
      <NuxtLink to="/">
        <ApplicationLogo class="w-20 h-20 fill-current text-gray-500" />
      </NuxtLink>
    </template>

    <template v-slot:default>
      <!-- Validation Errors -->
      <AuthValidationErrors class="mb-4" :errors="errors" />

      <form @submit.prevent="submitForm">
        <!-- Name -->
        <div>
          <Label for="name">Name</Label>

          <Input
            id="name"
            name="name"
            type="text"
            class="block mt-1 w-full"
            required
            autoFocus
          />
        </div>

        <!-- Email Address -->
        <div class="mt-4">
          <Label for="email">Email</Label>

          <Input
            id="email"
            name="email"
            type="email"
            class="block mt-1 w-full"
            required
          />
        </div>

        <!-- Password -->
        <div class="mt-4">
          <Label for="password">Password</Label>

          <Input
            id="password"
            name="password"
            type="password"
            class="block mt-1 w-full"
            required
            autoComplete="new-password"
          />
        </div>

        <!-- Confirm Password -->
        <div class="mt-4">
          <Label for="password_confirmation"> Confirm Password </Label>

          <Input
            id="password_confirmation"
            name="passwordConfirmation"
            type="password"
            class="block mt-1 w-full"
            required
          />
        </div>

        <div class="flex items-center justify-end mt-4">
          <NuxtLink to="/login">
            <a class="underline text-sm text-gray-600 hover:text-gray-900">
              Already registered?
            </a>
          </NuxtLink>

          <Button class="ml-4">Register</Button>
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
const errors = ref([]);

async function submitForm(event) {
  const { name, email, password, passwordConfirmation } = event.target.elements;

  await this.$breezeRegister({
    name: name.value,
    email: email.value,
    password: password.value,
    passwordConfirmation: passwordConfirmation.value,
    setErrors: (newErrors) => (errors.value = newErrors),
  });

  name.value = '';
  email.value = '';
  password.value = '';
  passwordConfirmation.value = '';
}
</script>
