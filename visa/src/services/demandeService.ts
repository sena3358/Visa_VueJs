export type DemandeItem = {
  idDemande?: number
  dateCreation?: string
  demandeur?: {
    idDemandeur?: number
    nom?: string
    prenom?: string
    nomJeuneFille?: string
    adresse?: string
    telephone?: string
    dateNaissance?: string
    email?: string
    nationnalite?: { libelle?: string }
    situationFamil?: { libelle?: string }
  }
  demandeType?: { libelle?: string }
  visaType?: { libelle?: string }
  visaTransformable?: {
    idVisaTransformable?: number
    dateCreation?: string
    dateExpiration?: string
    passport?: {
      idPassport?: number
      numero?: string
      dateDelivrance?: string
      dateExpiration?: string
      dateCreation?: string
    }
  }
  currentStatus?: string
  providedPieces?: {
    idVisaDemdPiece?: number
    docUrl?: string | null
    piece?: { idPieceCom?: number; libelle?: string; obligatoire?: boolean }
  }[]
  missingPieces?: { idPieceCom?: number; libelle?: string; obligatoire?: boolean }[]
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

export const fetchDemandeByIdSingle = async (numero: string) => {
  const data = await fetchDemandeById(numero)
  return data.length > 0 ? data[0] : null
}
