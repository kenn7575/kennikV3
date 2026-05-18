import * as admin from "firebase-admin"

let initialized = false

export function getFirebaseAdmin(): typeof admin {
  if (!initialized) {
    let credential: admin.credential.Credential

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_JSON, "base64").toString()
      )
      credential = admin.credential.cert(serviceAccount)
    } else {
      // Local dev: load from file (gitignored via *firebase-adminsdk*.json)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require("../vennik-v3-firebase-adminsdk-fbsvc-469ed116fa.json")
      credential = admin.credential.cert(serviceAccount)
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "vennik-v3.appspot.com",
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
