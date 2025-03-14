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
      <q-list bordered v-if="filteredUsers.length > 0">
        <q-item v-for="user in filteredUsers" :key="user.id" class="q-my-sm" clickable>
          <q-item-section>
            <q-item-label>{{ user.name }}</q-item-label>
            <q-item-label caption>{{ user.email }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-checkbox
              v-model="user.role"
              :true-value="'admin'"
              :false-value="'user'"
              label="Admin"
            />
          </q-item-section>

          <q-item-section side>
            <q-btn color="primary" @click.stop="confirmUser(user)" label="Confirmar" />
          </q-item-section>

          <q-item-section side>
            <q-btn color="negative" @click.stop="deleteUser(user)" label="Excluir" />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Mensagem se não houver usuários -->
      <div v-else class="text-center q-pa-md">
        <q-icon name="info" size="2em" class="q-mb-sm" />
        <p>Nenhum usuário aguardando aprovação.</p>
      </div>
    </q-card>

    <!-- Modal de confirmação -->
    <q-dialog v-model="confirmModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar ação</div>
        </q-card-section>

        <q-card-section>
          Tem certeza que deseja {{ actionType === 'confirm' ? 'confirmar' : 'excluir' }} este
          usuário?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Confirmar" color="primary" @click="handleAction" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const awaitingUsers = ref([])
const searchEmail = ref('')
const confirmModal = ref(false)
const selectedUser = ref(null)
const actionType = ref('')

// Filtra os usuários pelo e-mail
const filteredUsers = computed(() => {
  if (!searchEmail.value) return awaitingUsers.value
  return awaitingUsers.value.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.value.toLowerCase()),
  )
})

onMounted(async () => {
  await fetchAwaitingUsers()
})

async function fetchAwaitingUsers() {
  try {
    const response = await axios.get('http://localhost:3000/api/users/awaiting-users')
    if (response.data.users && Array.isArray(response.data.users)) {
      awaitingUsers.value = response.data.users.map((user) => ({ ...user, role: 'user' }))
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

function confirmUser(user) {
  selectedUser.value = user
  actionType.value = 'confirm'
  confirmModal.value = true
}

function deleteUser(user) {
  selectedUser.value = user
  actionType.value = 'delete'
  confirmModal.value = true
}

async function handleAction() {
  if (actionType.value === 'confirm') {
    await confirmUserAction()
  } else {
    await deleteUserAction()
  }
  confirmModal.value = false
}

async function confirmUserAction() {
  try {
    await axios.post('http://localhost:3000/api/admin/confirm-user', {
      id: selectedUser.value.id,
      role: selectedUser.value.role,
    })
    $q.notify({
      type: 'positive',
      message: 'Usuário confirmado com sucesso!',
    })
    await fetchAwaitingUsers()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message,
    })
  }
}

async function deleteUserAction() {
  try {
    await axios.delete(`http://localhost:3000/api/admin/delete-user/${selectedUser.value.email}`)
    $q.notify({
      type: 'positive',
      message: 'Usuário excluído com sucesso!',
    })
    await fetchAwaitingUsers()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message,
    })
  }
}
</script>

<style scoped>
.q-item {
  border-radius: 10px;
  margin-bottom: 8px;
}
</style>
