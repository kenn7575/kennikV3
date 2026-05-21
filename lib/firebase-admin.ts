import * as admin from "firebase-admin"

let initialized = false

export function getFirebaseAdmin(): typeof admin {
  if (!initialized) {
    let credential: admin.credential.Credential

    if (process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT as string
      )
      credential = admin.credential.cert(serviceAccount)
    } else {
      throw new Error(
        "FIREBASE_ADMIN_SERVICE_ACCOUNT env var is required in production"
      )
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential,
        storageBucket:
          process.env.FIREBASE_STORAGE_BUCKET ?? "vennik-v3.appspot.com",
      })
    }
    initialized = true
  }
  return admin
}

export function getStorageBucket() {
  const a = getFirebaseAdmin()
  return a.storage().bucket()
}
