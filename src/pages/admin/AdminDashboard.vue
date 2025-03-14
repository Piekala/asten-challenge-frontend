<template>
  <q-page class="flex flex-center column">
    <div class="text-center">
      <h1 class="text-h4">Painel de Administração</h1>
      <p class="text-h6">Bem-vindo, {{ userName }}</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

const router = useRouter()
const userName = ref('')

// Função para verificar se o usuário é admin
async function checkAdmin() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Token não encontrado')
    }

    const response = await api.get('http://localhost:3000/api/auth/check-admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.role !== 'admin') {
      throw new Error('Usuário não é admin')
    }

    // Atualiza o nome do usuário
    userName.value = response.data.name
  } catch (error) {
    console.error('Erro ao verificar admin:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
}

// Verifica se o usuário é admin ao carregar a página
onMounted(async () => {
  await checkAdmin()
})
</script>

<style scoped>
/* Garante que o conteúdo ocupe toda a altura disponível */
.q-page {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
