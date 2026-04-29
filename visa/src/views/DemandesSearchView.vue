<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  fetchDemandeById,
  fetchDemandesByPassport,
  type DemandeItem,
} from '../services/demandeService'

const passportNumero = ref('')
const demandeNumero = ref('')
const loadingPassport = ref(false)
const loadingDemande = ref(false)
const errorMessage = ref('')
const demandes = ref<DemandeItem[]>([])

const hasResults = computed(() => demandes.value.length > 0)

const formatDate = (value?: string) => {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('fr-FR')
}

const clearMessages = () => {
  errorMessage.value = ''
}

const searchByPassport = async () => {
  const numero = passportNumero.value.trim()
  if (!numero) {
    errorMessage.value = 'Veuillez saisir un numero de passeport.'
    demandes.value = []
    return
  }

  clearMessages()
  loadingPassport.value = true
  try {
    const data = await fetchDemandesByPassport(numero)
    demandes.value = data
    if (demandes.value.length === 0) {
      errorMessage.value = 'Aucune demande trouvee pour ce passeport.'
    }
  } catch (error) {
    demandes.value = []
    errorMessage.value =
      error instanceof Error ? error.message : 'Erreur inconnue.'
  } finally {
    loadingPassport.value = false
  }
}

const searchByDemande = async () => {
  const numero = demandeNumero.value.trim()
  if (!numero) {
    errorMessage.value = 'Veuillez saisir un numero de demande.'
    demandes.value = []
    return
  }

  clearMessages()
  loadingDemande.value = true
  try {
    const data = await fetchDemandeById(numero)
    demandes.value = data
    if (demandes.value.length === 0) {
      errorMessage.value = 'Demande introuvable.'
    }
  } catch (error) {
    demandes.value = []
    errorMessage.value =
      error instanceof Error ? error.message : 'Erreur inconnue.'
  } finally {
    loadingDemande.value = false
  }
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo-dot"></div>
        <div>
          <p class="brand-name">Visa Desk</p>
          <span>Management</span>
        </div>
      </div>

      <nav class="nav">
        <button class="nav-item is-active" type="button">Demandes</button>
        <!-- <button class="nav-item" type="button">Passeports</button>
        <button class="nav-item" type="button">Demandeurs</button>
        <button class="nav-item" type="button">Historique</button> -->
      </nav>

      
    </aside>

    <main class="content">
      <header class="headline">
        <div>
          <h1>Recherche de demandes</h1>
          <!-- <p>
            Trouvez rapidement les demandes liees a un passeport ou a un numero
            de demande.
          </p> -->
        </div>
        <!-- <div class="headline-chip">
          <span>Interface Back-Office</span>
        </div> -->
      </header>

      <section class="search-panel">
        <div class="panel-title">
          <h2>Filtres rapides</h2>
        </div>
        <div class="form-grid">
          <form class="form-card" @submit.prevent="searchByPassport">
            <label for="passport">Numero de passeport</label>
            <input
              id="passport"
              v-model="passportNumero"
              type="text"
              placeholder="Ex: P12345678"
              autocomplete="off"
            />
            <button type="submit" :disabled="loadingPassport">
              <span v-if="loadingPassport">Recherche...</span>
              <span v-else>Rechercher</span>
            </button>
          </form>

          <form class="form-card" @submit.prevent="searchByDemande">
            <label for="demande">Numero de demande</label>
            <input
              id="demande"
              v-model="demandeNumero"
              type="text"
              placeholder="Ex: 1024"
              autocomplete="off"
            />
            <button type="submit" :disabled="loadingDemande">
              <span v-if="loadingDemande">Recherche...</span>
              <span v-else>Rechercher</span>
            </button>
          </form>
        </div>
      </section>

      <section class="results">
        <div class="results-header">
          <div>
            <h2>Demandes trouvees</h2>
          </div>
          <span class="count" v-if="hasResults">{{ demandes.length }}</span>
        </div>

        <p v-if="errorMessage" class="alert">
          {{ errorMessage }}
        </p>

        <div v-if="hasResults" class="results-grid">
          <article
            v-for="demande in demandes"
            :key="demande.idDemande"
            class="card"
          >
            <div class="card-top">
              <h3>#{{ demande.idDemande ?? '---' }}</h3>
              <span class="pill">
                {{ demande.demandeType?.libelle ?? 'Type inconnu' }}
              </span>
            </div>
            <p class="muted">Cree le {{ formatDate(demande.dateCreation) }}</p>
            <div class="card-row">
              <div>
                <span>Demandeur</span>
                <strong>
                  {{ demande.demandeur?.prenom ?? '-' }}
                  {{ demande.demandeur?.nom ?? '' }}
                </strong>
              </div>
              <div>
                <span>Visa</span>
                <strong>{{ demande.visaType?.libelle ?? '-' }}</strong>
              </div>
            </div>
            <div class="card-row">
              <div>
                <span>Passeport</span>
                <strong>
                  {{ demande.visaTransformable?.passport?.numero ?? '-' }}
                </strong>
              </div>
            </div>
          </article>
        </div>

        <p v-if="!hasResults && !errorMessage" class="empty">
          Aucune recherche lancee pour le moment.
        </p>
      </section>
    </main>
  </div>
</template>
