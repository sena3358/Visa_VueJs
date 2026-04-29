<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchDemandeByIdSingle, type DemandeItem } from '../services/demandeService'

const route = useRoute()
const demande = ref<DemandeItem | null>(null)
const loading = ref(false)
const errorMessage = ref('')

const demandeId = computed(() => String(route.params.id || ''))

const loadDemande = async () => {
  if (!demandeId.value) return
  loading.value = true
  errorMessage.value = ''
  try {
    demande.value = await fetchDemandeByIdSingle(demandeId.value)
    if (!demande.value) {
      errorMessage.value = 'Demande introuvable.'
    }
  } catch (error) {
    demande.value = null
    errorMessage.value =
      error instanceof Error ? error.message : 'Erreur inconnue.'
  } finally {
    loading.value = false
  }
}

watch(demandeId, () => {
  void loadDemande()
})

onMounted(() => {
  void loadDemande()
})
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
        <RouterLink class="nav-item" to="/">Demandes</RouterLink>
        <!-- <button class="nav-item" type="button">Passeports</button>
        <button class="nav-item" type="button">Demandeurs</button>
        <button class="nav-item" type="button">Historique</button> -->
      </nav>

      <!-- <div class="sidebar-card">
        <p class="eyebrow">API</p>
        <strong>http://localhost:8080</strong>
        <p class="muted">Dossier synchronise avec le back-office.</p>
      </div> -->
    </aside>

    <main class="content">
      <header class="detail-hero">
        <div>
          <p class="eyebrow">Detail demande</p>
          <h1>Demande #{{ demandeId }}</h1>
          <!-- <p class="muted">Vue detaillee depuis l'application Vue.</p> -->
        </div>
        <RouterLink class="ghost-button" to="/">Retour a la recherche</RouterLink>
      </header>

      <section class="detail-panel">
        <div v-if="loading" class="loading">Chargement en cours...</div>
        <p v-if="errorMessage" class="alert">{{ errorMessage }}</p>

        <div v-if="demande" class="detail-sections">
          <div class="section">
            <h2>Informations de la demande</h2>
            <div class="detail-grid">
              <div class="detail-card">
                <span>ID Demande</span>
                <strong>#{{ demande.idDemande }}</strong>
              </div>
              <div class="detail-card">
                <span>Date creation</span>
                <strong>{{ demande.dateCreation ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Statut</span>
                <strong>{{ demande.currentStatus ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Type de demande</span>
                <strong>{{ demande.demandeType?.libelle ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Type de visa</span>
                <strong>{{ demande.visaType?.libelle ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>ID Visa transformable</span>
                <strong>{{ demande.visaTransformable?.idVisaTransformable ?? '-' }}</strong>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Demandeur</h2>
            <div class="detail-grid">
              <div class="detail-card">
                <span>ID Demandeur</span>
                <strong>{{ demande.demandeur?.idDemandeur ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Nom</span>
                <strong>{{ demande.demandeur?.nom ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Prenom</span>
                <strong>{{ demande.demandeur?.prenom ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Nom jeune fille</span>
                <strong>{{ demande.demandeur?.nomJeuneFille ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Adresse</span>
                <strong>{{ demande.demandeur?.adresse ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Telephone</span>
                <strong>{{ demande.demandeur?.telephone ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Date naissance</span>
                <strong>{{ demande.demandeur?.dateNaissance ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Email</span>
                <strong>{{ demande.demandeur?.email ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Nationalite</span>
                <strong>{{ demande.demandeur?.nationnalite?.libelle ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Situation familiale</span>
                <strong>{{ demande.demandeur?.situationFamil?.libelle ?? '-' }}</strong>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Passeport et Visa transformable</h2>
            <div class="detail-grid">
              <div class="detail-card">
                <span>Numero passport</span>
                <strong>{{ demande.visaTransformable?.passport?.numero ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Date delivrance passport</span>
                <strong>{{ demande.visaTransformable?.passport?.dateDelivrance ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Date expiration passport</span>
                <strong>{{ demande.visaTransformable?.passport?.dateExpiration ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Date creation visa</span>
                <strong>{{ demande.visaTransformable?.dateCreation ?? '-' }}</strong>
              </div>
              <div class="detail-card">
                <span>Date expiration visa</span>
                <strong>{{ demande.visaTransformable?.dateExpiration ?? '-' }}</strong>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Pieces deja fournies</h2>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID Piece</th>
                    <th>Libelle</th>
                    <th>Obligatoire</th>
                    <th>Document</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!demande.providedPieces || demande.providedPieces.length === 0">
                    <td colspan="4">Aucune piece fournie pour le moment.</td>
                  </tr>
                  <tr v-for="row in demande.providedPieces" :key="row.idVisaDemdPiece">
                    <td>{{ row.piece?.idPieceCom ?? '-' }}</td>
                    <td>{{ row.piece?.libelle ?? '-' }}</td>
                    <td>{{ row.piece?.obligatoire ? 'Oui' : 'Non' }}</td>
                    <td>{{ row.docUrl ? 'Fournie' : 'Sans document' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="section">
            <h2>Pieces non encore fournies</h2>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID Piece</th>
                    <th>Libelle</th>
                    <th>Obligatoire</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!demande.missingPieces || demande.missingPieces.length === 0">
                    <td colspan="3">Toutes les pieces attendues sont deja fournies.</td>
                  </tr>
                  <tr v-for="piece in demande.missingPieces" :key="piece.idPieceCom">
                    <td>{{ piece.idPieceCom ?? '-' }}</td>
                    <td>{{ piece.libelle ?? '-' }}</td>
                    <td>{{ piece.obligatoire ? 'Oui' : 'Non' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
