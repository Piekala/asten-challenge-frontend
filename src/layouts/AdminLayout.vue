<template>
  <q-layout>
    <q-header elevated class="bg-primary text-white" style="height: 48px">
      <q-toolbar>
        <q-btn flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title> Painel de Administração </q-toolbar-title>
        <q-icon name="invert_colors" @click="toggleTheme" size="2em" class="q-mr-sm" />
        <q-btn flat round dense icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item clickable v-ripple to="/admin/awaiting-users" active-class="active-link">
          <q-item-section avatar>
            <q-icon name="schedule" />
          </q-item-section>
          <q-item-section> Usuários em Espera </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/user-list" active-class="active-link">
          <q-item-section avatar>
            <q-icon name="folder_shared" />
          </q-item-section>
          <q-item-section> Recursos de Usuários </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/documents" active-class="active-link">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section> Documentos </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/intern-area" active-class="active-link">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section> Área Interna </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/private-area" active-class="active-link">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const leftDrawerOpen = ref(false)

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
