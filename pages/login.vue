<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  definePageMeta({ layout: 'auth' })

  const router = useRouter()
  const authStore = useAuthStore()
  const { isLoading } = storeToRefs(authStore)

  const email = ref('')
  const password = ref('')
  const errorMessage = ref('')

  const canSubmit = computed(() => email.value.trim() !== '' && password.value.trim() !== '')

  async function handleSubmit() {
    errorMessage.value = ''

    if (!canSubmit.value) {
      errorMessage.value = 'Email and password are required.'
      return
    }

    try {
      await authStore.login(email.value, password.value)
      await router.push('/')
    } catch (error) {
      errorMessage.value = (error as { message?: string })?.message ?? 'Unable to sign in.'
    } finally {
      password.value = ''
    }
  }
</script>

<template>
  <div>
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold">Sign in</h2>
      <p class="text-base-content/70 mt-2">Use your account to access the book dashboard.</p>
    </div>

    <div v-if="errorMessage" class="alert alert-error mb-4">
      <span>{{ errorMessage }}</span>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <BaseInput
        v-model="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        :error="authStore.getFieldError('email') ?? undefined"
        required
      />

      <BaseInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        :error="authStore.getFieldError('password') ?? undefined"
        required
      />

      <BaseButton type="submit" :loading="isLoading" :disabled="!canSubmit || isLoading" block>
        Sign in
      </BaseButton>
    </form>
  </div>
</template>