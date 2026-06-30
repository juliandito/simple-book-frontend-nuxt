<script setup lang="ts">
  import { reactive } from 'vue'
  import { CreateBookSchema } from '~/schemas/book'
  import type { CreateBookRequest } from '~/schemas/book'

  const props = withDefaults(
    defineProps<{
      initialValues?: Partial<CreateBookRequest>
      loading?: boolean
      submitLabel?: string
    }>(),
    {
      initialValues: () => ({}),
      loading: false,
      submitLabel: 'Save',
    }
  )

  const emit = defineEmits<{
    submit: [values: CreateBookRequest]
    cancel: []
  }>()

  const form = reactive<Partial<CreateBookRequest>>({
    title: props.initialValues.title ?? '',
    author: props.initialValues.author ?? '',
    isbn: props.initialValues.isbn ?? '',
    description: props.initialValues.description ?? '',
    publishedYear: props.initialValues.publishedYear,
  })

  const errors = reactive<Partial<Record<keyof CreateBookRequest, string>>>({})

  function validate(): boolean {
    const result = CreateBookSchema.safeParse(form)
    Object.keys(errors).forEach((k) => delete errors[k as keyof typeof errors])
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof CreateBookRequest
        if (!errors[field]) errors[field] = issue.message
      })
      return false
    }
    return true
  }

  function handleSubmit() {
    if (!validate()) return
    emit('submit', form as CreateBookRequest)
  }
</script>

<template>
  <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
    <BaseInput
      v-model="form.title"
      label="Title"
      placeholder="Enter book title"
      required
      :error="errors.title"
    />
    <BaseInput
      v-model="form.author"
      label="Author"
      placeholder="Enter author name"
      required
      :error="errors.author"
    />
    <BaseInput
      v-model="form.isbn"
      label="ISBN"
      placeholder="e.g. 9780141439518"
      :error="errors.isbn"
    />
    <BaseInput
      v-model="form.description"
      label="Description"
      placeholder="Brief description"
      :error="errors.description"
    />
    <div class="form-control w-full">
      <label class="label"><span class="label-text">Published Year</span></label>
      <input
        v-model.number="form.publishedYear"
        type="number"
        :min="1000"
        :max="new Date().getFullYear()"
        placeholder="e.g. 2024"
        class="input input-bordered w-full"
        :class="errors.publishedYear ? 'input-error' : ''"
      />
      <label v-if="errors.publishedYear" class="label">
        <span class="label-text-alt text-error">{{ errors.publishedYear }}</span>
      </label>
    </div>

    <div class="flex gap-2 justify-end pt-2">
      <BaseButton type="button" variant="ghost" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" variant="primary" :loading="loading">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
