export type DemandeItem = {
  idDemande?: number
  dateCreation?: string
  demandeur?: { nom?: string; prenom?: string }
  demandeType?: { libelle?: string }
  visaType?: { libelle?: string }
  visaTransformable?: { passport?: { numero?: string } }
}

const apiBase = 'http://localhost:8080'

const readJsonIfPresent = async (response: Response) => {
  if (response.status === 204) return []
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error("La reponse n'est pas en JSON.")
  }
  return response.json()
}

export const fetchDemandesByPassport = async (numero: string) => {
  const response = await fetch(
    `${apiBase}/api/demandes/by-passport/${encodeURIComponent(numero)}`,
  )

  if (response.status === 404) {
    return []
  }
  if (!response.ok && response.status !== 204) {
    throw new Error('Erreur serveur lors de la recherche.')
  }

  const data = await readJsonIfPresent(response)
  return Array.isArray(data) ? data : []
}

export const fetchDemandeById = async (numero: string) => {
  const response = await fetch(
    `${apiBase}/api/demandes/${encodeURIComponent(numero)}`,
  )

  if (response.status === 404) {
    return []
  }
  if (!response.ok && response.status !== 204) {
    throw new Error('Erreur serveur lors de la recherche.')
  }

  const data = await readJsonIfPresent(response)
  return Array.isArray(data) ? data : data ? [data] : []
}
