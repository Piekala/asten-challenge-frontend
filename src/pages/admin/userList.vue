<template>
  <q-page class="flex flex-center column">
    <q-card class="full-width q-pa-md" style="max-width: 90%; margin-top: 1%; margin-bottom: auto">
      <!-- Campo de busca por e-mail -->
      <q-input v-model="searchEmail" outlined label="Buscar por e-mail" class="q-mb-md">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Lista de usuários -->
      <q-list v-if="filteredUsers.length > 0" bordered class="rounded-borders">
        <q-item v-for="user in filteredUsers" :key="user.id" clickable @click="openUserModal(user)">
          <q-item-section>
            <q-item-label>{{ user.name }}</q-item-label>
            <q-item-label caption>{{ user.email }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Mensagem se não houver usuários -->
      <div v-else class="text-center q-pa-md">
        <q-icon name="info" size="2em" class="q-mb-sm" />
        <p>Nenhum usuário encontrado.</p>
      </div>
    </q-card>

    <!-- Modal de usuário -->
    <UserModal ref="userModal" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import UserModal from '../../components/userModal.vue'

const $q = useQuasar()
const users = ref([])
const searchEmail = ref('')
const userModal = ref(null)

// Filtra os usuários pelo e-mail
const filteredUsers = computed(() => {
  if (!searchEmail.value) return users.value
  return users.value.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.value.toLowerCase()),
  )
})

onMounted(async () => {
  await fetchUsers()
})

// Busca os usuários da API
async function fetchUsers() {
  try {
    const response = await axios.get('http://localhost:3000/api/users/users')
    if (response.data.users && Array.isArray(response.data.users)) {
      users.value = response.data.users
    } else {
      console.error('Resposta inválida do servidor:', response.data)
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar usuários. Resposta inválida do servidor.',
      })
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message,
    })
  }
}

// Abre o modal com os detalhes do usuário
function openUserModal(user) {
  userModal.value.open(user)
}
</script>

<style scoped>
.q-list {
  border: 1px solid #ddd;
  border-radius: 8px;
}

.q-item {
  border-bottom: 1px solid #eee;
}

.q-item:last-child {
  border-bottom: none;
}
</style>
