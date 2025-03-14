<template>
  <q-page class="flex flex-center column">
    <div class="text-center">
      <h1 class="text-h4">Painel do Usuário</h1>
      <p class="text-h6">Bem-vindo, {{ userName }}</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')

// Função para buscar os dados do usuário
async function fetchUserData() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Token não encontrado')
    }

    // Busca os dados do usuário
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) {
      throw new Error('User não encontrado')
    }

    // Atualiza o nome do usuário
    userName.value = user.name
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}

onMounted(async () => {
  await fetchUserData()
})
</script>

<style scoped>
.q-page {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
