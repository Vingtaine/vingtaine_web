// Importer Firebase et les fonctions nécessaires
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, deleteUser, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Configuration Firebase pour Vingtaine
const firebaseConfig = {
  apiKey: "AIzaSyDqCbKd-MmrFHN2L_c8tvjlvkCJxPRB0WU",
  authDomain: "vingtaine.firebaseapp.com",
  projectId: "vingtaine",
  storageBucket: "vingtaine.firebasestorage.app",
  messagingSenderId: "341493884498",
  appId: "1:341493884498:web:7c011f0f57684da863e18b",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Vérifier si l'utilisateur est connecté
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Vous devez être connecté pour accéder à cette page.");
    window.location.href = "index.html"; // Redirection si non connecté
  }
});

// Fonction pour supprimer le compte via le backend
async function deleteAccountFromBackend(token) {
  const response = await fetch("https://webapi.vingtaine.app/v1/users", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du compte dans le backend.");
  }
}

// Gérer la suppression du compte
document.getElementById("delete-account").addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Aucun utilisateur connecté.");
    window.location.href = "index.html";
    return;
  }

  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
  if (!confirmation) return;

  try {
    const token = await user.getIdToken(); // Récupérer le token Firebase
    await deleteAccountFromBackend(token); // Supprimer via le backend
    await deleteUser(user); // Supprimer de Firebase
    alert("Votre compte a été supprimé avec succès.");
    window.location.href = "index.html"; // Redirection après suppression
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    alert("Impossible de supprimer le compte. Veuillez réessayer.");
  }
});

// Gérer l'annulation
document.getElementById("cancel").addEventListener("click", () => {
  window.location.href = "home.html"; // Redirection vers la page d'home
});
