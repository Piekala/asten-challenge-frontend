<template>
  <div class="fullscreen items-center" style="display: flex; flex-direction: column">
    <div
      style="
        align-items: center;
        flex-direction: row-reverse;
        margin-left: auto;
        margin-right: 5%;
        margin-top: 2%;
        height: 5%;
        min-height: 20px;
      "
    >
      <q-icon name="invert_colors" @click="toggleTheme" size="2em"></q-icon>
    </div>

    <q-card
      class="login-card flex items-center column justify-center"
      style="
        border-radius: 30px;
        width: 50%;
        height: 70%;
        margin-top: 8px;
        margin-bottom: auto;
        min-height: 500px;
        min-width: 400px;
      "
    >
      <div style="width: 100%; display: flex; justify-content: center; min-height: max-content">
        <q-item-label class="text-primary text-bold" style="font-size: 32px"> ACESSO </q-item-label>
      </div>

      <div
        style="
          width: 70%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 5%;
          margin-bottom: 5%;
        "
      >
        <q-input
          rounded
          outlined
          v-model="email"
          style="width: 100%; margin-bottom: 5%"
          label="Email"
          class="text-center"
        ></q-input>

        <q-input
          rounded
          outlined
          v-model="password"
          style="width: 100%; margin-bottom: 5%"
          label="Senha"
          class="text-center"
          type="password"
        ></q-input>
        <q-item-label
          style="margin-left: auto; margin-right: 5%"
          class="text-primary text-bold"
          @click="forgot"
          >Esqueceu sua senha?</q-item-label
        >
      </div>

      <div
        style="
          width: 70%;
          align-items: center;
          justify-content: space-between;
          display: flex;
          flex-direction: column;
          height: 20%;
        "
      >
        <q-btn
          class="bg-primary text-auto full-width text-bold"
          rounded
          @click="login"
          style="margin-top: auto"
        >
          Entrar
        </q-btn>
        <q-item-label
          class="text-bold"
          @click="goToRegister"
          style="cursor: pointer; margin-bottom: auto; margin-top: 16px"
          >Registre-se</q-item-label
        >
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const email = ref('')
const password = ref('')

// Função para alternar o tema
function toggleTheme() {
  $q.dark.set(!$q.dark.isActive)
}

function forgot() {
  $q.notify({
    type: 'error',
    message: 'Botão apenas visual, API necessária!',
  })
}

async function login() {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    // Salva o token e os dados do usuário no localStorage
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    // Exibe uma notificação de sucesso
    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!',
    })

    // Redireciona para a página inicial ou painel do usuário/admin
    const user = response.data.user
    if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/user')
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao fazer login. Tente novamente.',
    })
  }
}

function goToRegister() {
  router.push('/register')
}

function handleKeyDown(event) {
  if (event.key === 'Enter') {
    login()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>
