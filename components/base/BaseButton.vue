<script setup lang="ts">
  type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'error' | 'warning' | 'success'
  type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

  withDefaults(
    defineProps<{
      variant?: ButtonVariant
      size?: ButtonSize
      loading?: boolean
      disabled?: boolean
      type?: 'button' | 'submit' | 'reset'
      block?: boolean
    }>(),
    {
      variant: 'primary',
      size: 'md',
      loading: false,
      disabled: false,
      type: 'button',
      block: false,
    }
  )
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn-${variant}`,
      size !== 'md' ? `btn-${size}` : '',
      block ? 'btn-block' : '',
      loading ? 'loading loading-spinner' : '',
    ]"
  >
    <slot />
  </button>
</template>
