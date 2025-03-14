<template>
  <div class="fullscreen items-center scroll" style="display: flex; flex-direction: column">
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
      class="register-card flex items-center justify-center"
      style="
        border-radius: 30px;
        width: 50%;
        height: 80%;
        margin-top: 8px;
        min-height: 600px;
        min-width: 400px;
        flex-direction: column;
      "
    >
      <div style="width: 100%; display: flex; justify-content: center; min-height: max-content">
        <q-item-label class="text-primary text-bold" style="font-size: 32px">
          REGISTRO
        </q-item-label>
      </div>

      <div
        style="
          width: 70%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 5%;
          margin-bottom: 2.5%;
        "
      >
        <q-input
          rounded
          outlined
          v-model="name"
          style="width: 100%; margin-bottom: 8px"
          label="Nome"
          class="text-center"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        ></q-input>

        <q-input
          rounded
          outlined
          v-model="email"
          style="width: 100%; margin-bottom: 8px"
          label="Email"
          class="text-center"
          :rules="[
            (val) => !!val || 'Campo obrigatório',
            (val) => isValidEmail(val) || 'E-mail inválido',
          ]"
        ></q-input>

        <q-input
          rounded
          outlined
          v-model="password"
          style="width: 100%; margin-bottom: 8px"
          label="Senha"
          class="text-center"
          type="password"
          :rules="[(val) => !!val || 'Campo obrigatório']"
        ></q-input>

        <q-input
          rounded
          outlined
          v-model="confirmPassword"
          style="width: 100%; margin-bottom: 8px"
          label="Confirmar Senha"
          class="text-center"
          type="password"
          :rules="[
            (val) => !!val || 'Campo obrigatório',
            (val) => val === password || 'As senhas não coincidem',
          ]"
        ></q-input>
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
          @click="register"
          style="margin-top: auto"
        >
          Registrar
        </q-btn>
        <q-item-label
          class="text-bold"
          @click="goToLogin"
          style="cursor: pointer; margin-bottom: auto; margin-top: 16px"
        >
          Já tem uma conta? Faça login
        </q-item-label>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function toggleTheme() {
  $q.dark.set(!$q.dark.isActive)
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

async function register() {
  try {
    if (!name.value || !email.value || !password.value || !confirmPassword.value) {
      $q.notify({
        type: 'negative',
        message: 'Preencha todos os campos.',
      })
      return
    }

    if (!isValidEmail(email.value)) {
      $q.notify({
        type: 'negative',
        message: 'E-mail inválido.',
      })
      return
    }

    if (password.value !== confirmPassword.value) {
      $q.notify({
        type: 'negative',
        message: 'As senhas não coincidem.',
      })
      return
    }

    const response = await axios.post('http://localhost:3000/api/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
    })
    console.log(response.status)
    $q.notify({
      type: 'positive',
      message: 'Registro realizado com sucesso!',
    })

    router.push('/login')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Erro ao registrar. Tente novamente.',
    })
  }
}

function goToLogin() {
  router.push('/login')
}
</script>
