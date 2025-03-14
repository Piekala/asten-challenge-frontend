<template>
  <q-page class="flex flex-center column q-pa-md">
    <q-card class="full-width" style="max-width: 90%">
      <!-- Listas de Acessos -->
      <div class="row q-gutter-md">
        <!-- Acessos Válidos -->
        <q-card class="col" style="min-width: 300px">
          <q-card-section>
            <div class="text-h6">Acessos Válidos</div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item v-if="hasValidDocAccess">
                <q-item-section>
                  <q-item-label>Documentos</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="hasValidPrivateAccess">
                <q-item-section>
                  <q-item-label>Área Privada</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="hasValidInternAccess">
                <q-item-section>
                  <q-item-label>Área Interna</q-item-label>
                </q-item-section>
              </q-item>
              <div v-if="!hasValidAccess" class="text-center q-pa-md">
                <q-icon name="info" size="2em" class="q-mb-sm" />
                <p>Não possui permissões ativas.</p>
              </div>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Acessos Expirados -->
        <q-card class="col" style="min-width: 300px">
          <q-card-section>
            <div class="text-h6">Acessos Expirados</div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item v-if="hasExpiredDocAccess">
                <q-item-section>
                  <q-item-label>Documentos</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="hasExpiredPrivateAccess">
                <q-item-section>
                  <q-item-label>Área Privada</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="hasExpiredInternAccess">
                <q-item-section>
                  <q-item-label>Área Interna</q-item-label>
                </q-item-section>
              </q-item>
              <div v-if="!hasExpiredAccess" class="text-center q-pa-md">
                <q-icon name="info" size="2em" class="q-mb-sm" />
                <p>Não possui expirados.</p>
              </div>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Acessos Prestes a Expirar -->
        <q-card class="col" style="min-width: 300px">
          <q-card-section>
            <div class="text-h6">Acessos Prestes a Expirar</div>
          </q-card-section>
          <q-card-section>
            <q-list bordered>
              <q-item v-for="access in expiringSoonAccess" :key="access.id">
                <q-item-section>
                  <q-item-label>{{ getTableName(access.tabela) }}</q-item-label>
                  <q-item-label caption>
                    Expira em: {{ formatExpiration(access.data_criacao, access.tempo_duracao) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <div v-if="expiringSoonAccess.length === 0" class="text-center q-pa-md">
                <q-icon name="info" size="2em" class="q-mb-sm" />
                <p>Não possui próximos à expirar.</p>
              </div>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const allAccess = ref([])

// Verifica se há acessos válidos
const hasValidDocAccess = computed(() => {
  return allAccess.value.some((access) => access.tabela === 'docAccess' && access.valido)
})

const hasValidPrivateAccess = computed(() => {
  return allAccess.value.some((access) => access.tabela === 'privateAccess' && access.valido)
})

const hasValidInternAccess = computed(() => {
  return allAccess.value.some((access) => access.tabela === 'internAccess' && access.valido)
})

const hasValidAccess = computed(() => {
  return hasValidDocAccess.value || hasValidPrivateAccess.value || hasValidInternAccess.value
})

// Verifica se há acessos expirados
const hasExpiredDocAccess = computed(() => {
  return allAccess.value.some((access) => access.tabela === 'docAccess' && !access.valido)
})

const hasExpiredPrivateAccess = computed(() => {
  return allAccess.value.some((access) => access.tabela === 'privateAccess' && !access.valido)
})

const hasExpiredInternAccess = computed(() => {
  return allAccess.value.some((access) => access.tabela === 'internAccess' && !access.valido)
})

const hasExpiredAccess = computed(() => {
  return hasExpiredDocAccess.value || hasExpiredPrivateAccess.value || hasExpiredInternAccess.value
})

// Filtra os acessos prestes a expirar (2 dias ou menos)
const expiringSoonAccess = computed(() => {
  return allAccess.value.filter((access) => {
    if (!access.valido) return false

    const tempoDuracaoSegundos = convertTempoDuracaoToSeconds(access.tempo_duracao)
    const expirationDate = new Date(
      new Date(access.data_criacao).getTime() + tempoDuracaoSegundos * 1000,
    )
    const now = new Date().getTime()
    const diffInDays = (expirationDate - now) / (1000 * 60 * 60 * 24)

    return diffInDays <= 2 && diffInDays > 0
  })
})

function convertTempoDuracaoToSeconds(tempoDuracao) {
  if (typeof tempoDuracao === 'object' && tempoDuracao.hours) {
    return tempoDuracao.hours * 3600
  }
  return tempoDuracao
}

function formatExpiration(dataCriacao, tempoDuracao) {
  const tempoDuracaoSegundos = convertTempoDuracaoToSeconds(tempoDuracao)
  const expirationDate = new Date(new Date(dataCriacao).getTime() + tempoDuracaoSegundos * 1000)
  const now = new Date().getTime()
  const diffInDays = (expirationDate - now) / (1000 * 60 * 60 * 24)

  if (diffInDays < 0) {
    return 'Expirado'
  } else if (diffInDays < 1) {
    return 'Menos de um dia'
  } else if (diffInDays <= 2) {
    return `${Math.floor(diffInDays)} dia(s)`
  } else {
    return `${Math.floor(diffInDays)}+ dias`
  }
}

// Retorna o nome da tabela formatado
function getTableName(tabela) {
  switch (tabela) {
    case 'docAccess':
      return 'Documentos'
    case 'privateAccess':
      return 'Área Privada'
    case 'internAccess':
      return 'Área Interna'
    default:
      return tabela
  }
}

// Atualiza os acessos expirados
async function updateExpiredAccess() {
  try {
    await axios.put('http://localhost:3000/api/permissions/update-expired')
  } catch (error) {
    console.error('Erro ao atualizar acessos expirados:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar acessos expirados.',
    })
  }
}

// Busca os acessos do usuário
async function fetchAccess(email) {
  try {
    const response = await axios.get(`http://localhost:3000/api/permissions/all/${email}`)
    allAccess.value = [
      ...response.data.docAccess.map((access) => ({ ...access, tabela: 'docAccess' })),
      ...response.data.privateAccess.map((access) => ({ ...access, tabela: 'privateAccess' })),
      ...response.data.internAccess.map((access) => ({ ...access, tabela: 'internAccess' })),
    ]
    console.log(allAccess)
  } catch (error) {
    console.error('Erro ao buscar acessos:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao buscar acessos.',
    })
  }
}

// Busca os acessos ao carregar a página
onMounted(async () => {
  const userEmail = JSON.parse(localStorage.getItem('user')).email

  // Atualiza os acessos expirados antes de buscar os dados
  await updateExpiredAccess()

  // Busca os acessos do usuário
  await fetchAccess(userEmail)
})
</script>

<style scoped>
.q-card {
  border-radius: 8px;
}

.q-list {
  border-radius: 8px;
}
</style>
