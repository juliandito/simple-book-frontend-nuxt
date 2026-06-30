<script setup lang="ts">
  defineProps<{
    modelValue?: string | number
    label?: string
    placeholder?: string
    type?: string
    error?: string
    disabled?: boolean
    required?: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()
</script>

<template>
  <div class="form-control w-full">
    <label v-if="label" class="label">
      <span class="label-text">
        {{ label }}
        <span v-if="required" class="text-error ml-1" aria-hidden="true">*</span>
      </span>
    </label>
    <input
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="['input input-bordered w-full', error ? 'input-error' : '']"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
