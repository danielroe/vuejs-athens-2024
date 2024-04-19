<template>
  <main class="container">
    <!-- Form to allow user to modify data -->
    <form @submit.prevent="updateMalleables">
      <input type="text" v-model="prompt">
      <button type="submit" :aria-busy="status === 'pending'">Update app</button>
    </form>
    <pre>{{ malleables.template }}</pre>
    <!-- Malleable component to display data -->
    <MalleableComponent />
  </main>
</template>

<script setup>
import '@picocss/pico'

const malleables = reactive({
  template: `
<ul>
  <li v-for="country in data.data.countries" :key="country.code">
    {{ country.capital || '' }}
  </li>
</ul>
`,
  query: `
query {
  countries {
    awsRegion
    code
    capital
    continent {
      name
    }
    emoji
  }
}
`
})

const MalleableComponent = defineComponent({
  async setup () {
    const { data } = await useFetch('https://countries.trevorblades.com/', {
      method: 'POST',
      body: {
        query: malleables.query
      }
    })

    return () => h({
      template: malleables.template,
      data: () => ({ data })
    })
  }
})

const prompt = ref('')
const status = ref('idle')
async function updateMalleables () {
  status.value = 'pending'
  const body = await $fetch('/api/completion', {
    method: 'POST',
    body: {
      prompt: prompt.value,
      malleables
    }
  })
  for (const key of ['template', 'query']) {
    malleables[key] = body.malleables[key]
  }
  status.value = 'idle'
  // TODO: add error handling
}
</script>
