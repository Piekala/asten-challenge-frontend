<template>
  <q-layout>
    <q-header elevated class="bg-primary text-white" style="height: 48px">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title> Painel do Usuário </q-toolbar-title>
        <q-icon name="invert_colors" @click="toggleTheme" size="2em" class="q-mr-sm" />
        <q-btn flat round dense icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item clickable v-ripple to="/user/access" active-class="active-link">
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section> Seus Acessos </q-item-section>
        </q-item>

        <!-- Botão para "Documentos" (visível apenas se tiver acesso) -->
        <q-item
          v-if="hasDocumentAccess"
          clickable
          v-ripple
          to="/user/documents"
          active-class="active-link"
        >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section> Documentos </q-item-section>
        </q-item>

        <!-- Botão para "Área Interna" (visível apenas se tiver acesso) -->
        <q-item
          v-if="hasInternalAccess"
          clickable
          v-ripple
          to="/user/intern-area"
          active-class="active-link"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section> Área Interna </q-item-section>
        </q-item>

        <!-- Botão para "Acesso Privado" (visível apenas se tiver acesso) -->
        <q-item
          v-if="hasPrivateAccess"
          clickable
          v-ripple
          to="/user/private-area"
          active-class="active-link"
        >
          <q-item-section avatar>
            <q-icon name="security" />
          </q-item-section>
          <q-item-section> Acesso Privado </q-item-section>
        </q-item>

        <q-space />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const router = useRouter()
const leftDrawerOpen = ref(false)

// Estados para controlar a visibilidade dos itens do menu
const hasDocumentAccess = ref(false)
const hasInternalAccess = ref(false)
const hasPrivateAccess = ref(false)

// Função para buscar os acessos do usuário
async function fetchUserAccess() {
  try {
    const userEmail = JSON.parse(localStorage.getItem('user')).email
    const response = await axios.get(`http://localhost:3000/api/permissions/latest/${userEmail}`)
    const latestAccess = response.data

    // Verifica quais acessos estão ativos
    if (latestAccess.docAccess && latestAccess.docAccess.valido) {
      hasDocumentAccess.value = true
    }
    if (latestAccess.internAccess && latestAccess.internAccess.valido) {
      hasInternalAccess.value = true
    }
    if (latestAccess.privateAccess && latestAccess.privateAccess.valido) {
      hasPrivateAccess.value = true
    }
  } catch (error) {
    console.error('Erro ao buscar acessos do usuário:', error)
  }
}

// Função para alternar entre tema claro e escuro
function toggleTheme() {
  $q.dark.set(!$q.dark.isActive)
}

// Função para logout
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

// Busca os acessos do usuário ao carregar o componente
onMounted(() => {
  fetchUserAccess()
})
</script>

<style scoped>
.active-link {
  color: 'primary';
  background-color: var(--q-secondary);
}

.full-height {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-mb-md {
  margin-bottom: 5%;
}

.q-icon {
  cursor: pointer;
}
</style>
