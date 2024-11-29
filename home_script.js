// Importer Firebase
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  deleteUser, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDqCbKd-MmrFHN2L_c8tvjlvkCJxPRB0WU",
  authDomain: "vingtaine.firebaseapp.com",
  databaseURL: "https://vingtaine.firebaseio.com",
  projectId: "vingtaine",
  storageBucket: "vingtaine.firebasestorage.app",
  messagingSenderId: "341493884498",
  appId: "1:341493884498:web:7c011f0f57684da863e18b",
  measurementId: "G-KETHP0KEZS",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Vérifier l'état de l'utilisateur
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Utilisateur connecté : affiche les informations dans la console
    console.log("Utilisateur connecté :", user);
  } else {
    // Rediriger si aucun utilisateur n'est connecté
    console.log("Aucun utilisateur connecté, redirection...");
    window.location.href = "index.html";
  }
});

// Déconnexion de l'utilisateur
document.getElementById("logout").addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Déconnexion réussie.");
    window.location.href = "index.html";
  } catch (error) {
   console.error("Erreur lors de la déconnexion :", error);
   alert("Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
  }
})



// Gestion de la suppression du compte utilisateur
document.getElementById("delete-account").addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Aucun utilisateur connecté. Redirection vers la page de connexion.");
    window.location.href = "index.html";
    return;
  }

  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
  if (!confirmation) return;

  try {
    // Demander les informations pour la réauthentification
    const email = prompt("Veuillez entrer votre e-mail pour confirmer :");
    const password = prompt("Veuillez entrer votre mot de passe :");

    if (email && password) {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Réauthentification réussie.");

      // Suppression du compte
      await deleteUser(user);
      alert("Votre compte a été supprimé avec succès.");
      window.location.href = "index.html"; // Rediriger après la suppression
    } else {
      alert("Réauthentification annulée.");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du compte :", error);
    alert("Impossible de supprimer votre compte. Vérifiez vos informations et réessayez.");
  }
});
