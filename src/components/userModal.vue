<template>
  <q-dialog v-model="userModal">
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Gerenciar Acessos</div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-center items-center q-gutter-md">
          <div class="column items-center">
            <div class="text-subtitle1 q-mb-sm">Documentos</div>
            <q-badge
              rounded
              :color="selectedUser.documentos.active ? 'green' : 'red'"
              :label="selectedUser.documentos.active ? 'Ativo' : 'Inativo'"
            />
            <q-input
              v-if="!selectedUser.documentos.active"
              v-model.number="selectedUser.documentos.days"
              type="number"
              label="Dias"
              min="1"
              outlined
              class="q-mt-md"
              style="width: 120px"
            />
            <q-btn
              v-else
              color="negative"
              label="Revogar"
              class="q-mt-md"
              @click="openRevokeModal('docAccess')"
            />
          </div>

          <q-separator vertical color="grey-5" style="height: 100px" />

          <div class="column items-center">
            <div class="text-subtitle1 q-mb-sm">Acesso Privado</div>
            <q-badge
              rounded
              :color="selectedUser.acessoPrivado.active ? 'green' : 'red'"
              :label="selectedUser.acessoPrivado.active ? 'Ativo' : 'Inativo'"
            />
            <q-input
              v-if="!selectedUser.acessoPrivado.active"
              v-model.number="selectedUser.acessoPrivado.days"
              type="number"
              label="Dias"
              min="1"
              outlined
              class="q-mt-md"
              style="width: 120px"
            />
            <q-btn
              v-else
              color="negative"
              label="Revogar"
              class="q-mt-md"
              @click="openRevokeModal('privateAccess')"
            />
          </div>

          <q-separator vertical color="grey-5" style="height: 100px" />

          <div class="column items-center">
            <div class="text-subtitle1 q-mb-sm">Acesso Interno</div>
            <q-badge
              rounded
              :color="selectedUser.acessoInterno.active ? 'green' : 'red'"
              :label="selectedUser.acessoInterno.active ? 'Ativo' : 'Inativo'"
            />
            <q-input
              v-if="!selectedUser.acessoInterno.active"
              v-model.number="selectedUser.acessoInterno.days"
              type="number"
              label="Dias"
              min="1"
              outlined
              class="q-mt-md"
              style="width: 120px"
            />
            <q-btn
              v-else
              color="negative"
              label="Revogar"
              class="q-mt-md"
              @click="openRevokeModal('internAccess')"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Confirmar" color="primary" @click="handleConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="revokeModal">
    <q-card>
      <q-card-section>
        <div class="text-h6">Confirmar Revogação</div>
      </q-card-section>
      <q-card-section>Tem certeza que deseja revogar o acesso?</q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn flat label="Confirmar" color="negative" @click="handleRevoke" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const userModal = ref(false)
const revokeModal = ref(false)
const selectedUser = ref({
  id: null,
  email: '',
  documentos: { active: false, days: 1 },
  acessoPrivado: { active: false, days: 1 },
  acessoInterno: { active: false, days: 1 },
})
const revokeAccessType = ref('')

async function open(user) {
  selectedUser.value = {
    id: user.id,
    email: user.email,
    documentos: { active: false, days: 0 },
    acessoPrivado: { active: false, days: 0 },
    acessoInterno: { active: false, days: 0 },
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/permissions/latest/${user.email}`)
    const latestAccess = response.data
    selectedUser.value.documentos.active = latestAccess.docAccess?.valido || false
    selectedUser.value.acessoPrivado.active = latestAccess.privateAccess?.valido || false
    selectedUser.value.acessoInterno.active = latestAccess.internAccess?.valido || false
  } catch (error) {
    console.error('Erro ao buscar acessos mais recentes:', error)
  }

  userModal.value = true
}

function openRevokeModal(accessType) {
  revokeAccessType.value = accessType
  revokeModal.value = true
}

async function handleRevoke() {
  try {
    await axios.put('http://localhost:3000/api/permissions/invalidate', {
      email: selectedUser.value.email,
      tabela: revokeAccessType.value,
    })

    // Fecha o modal de confirmação e recarrega os dados do usuário
    revokeModal.value = false
    await open({ id: selectedUser.value.id, email: selectedUser.value.email })
  } catch (error) {
    console.error('Erro ao revogar acesso:', error)
  }
}

async function handleConfirm() {
  try {
    const requests = []
    if (!selectedUser.value.documentos.active && selectedUser.value.documentos.days > 0) {
      requests.push(
        axios.post('http://localhost:3000/api/permissions/create', {
          email: selectedUser.value.email,
          tabelas: ['docAccess'],
          tempo_duracao: [selectedUser.value.documentos.days * 86400],
        }),
      )
    }
    if (!selectedUser.value.acessoPrivado.active && selectedUser.value.acessoPrivado.days > 0) {
      requests.push(
        axios.post('http://localhost:3000/api/permissions/create', {
          email: selectedUser.value.email,
          tabelas: ['privateAccess'],
          tempo_duracao: [selectedUser.value.acessoPrivado.days * 86400],
        }),
      )
    }
    if (!selectedUser.value.acessoInterno.active && selectedUser.value.acessoInterno.days > 0) {
      requests.push(
        axios.post('http://localhost:3000/api/permissions/create', {
          email: selectedUser.value.email,
          tabelas: ['internAccess'],
          tempo_duracao: [selectedUser.value.acessoInterno.days * 86400],
        }),
      )
    }

    await Promise.all(requests)
    userModal.value = false
  } catch (error) {
    console.error('Erro ao confirmar alterações:', error)
  }
}

defineExpose({ open })
</script>
