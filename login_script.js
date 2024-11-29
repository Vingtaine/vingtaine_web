// Importer et initialiser Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Configuration Firebase pour le projet "Vingtaine"
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

// Gérer la communication avec la fenêtre pop-up
let authWindow = null;

// Connexion via Google (ouverture d'une fenêtre pop-up)
document.getElementById("google-login").addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  // Ouvrir la fenêtre pop-up pour l'authentification Google
  authWindow = window.open('authWindow.html', 'authWindow', 'width=2000,height=200');
  
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Connexion réussie via Google");
      
      // Rediriger l'utilisateur vers la page d'home5 après la connexion réussie
      window.location.href = 'home.html';
      
      // Communiquer la réussite à la fenêtre principale après la connexion
      authWindow.postMessage({ type: 'authSuccess' }, 'https://seudominio.com');
    })
    .catch(error => {
      console.error("Erreur lors de la connexion avec Google", error);
      // Communiquer l'erreur à la fenêtre principale
      authWindow.postMessage({ type: 'authError', data: error.message }, 'https://127.0.0.1:8080');
    });
});

// Connexion via Facebook
document.getElementById("facebook-login").addEventListener("click", () => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      console.log("Connexion réussie via Facebook");
      
      // Rediriger l'utilisateur vers la page d'home après la connexion réussie
      window.location.href = 'home.html';
    })
    .catch(error => {
      console.error("Erreur lors de la connexion Facebook", error);
    });
});

// Connexion via e-mail
document.getElementById("email-login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      console.log("Connexion réussie avec e-mail");
      
      // Rediriger l'utilisateur vers la page d'home après la connexion réussie
      window.location.href = 'home.html';
    })
    .catch(error => {
      console.error("Erreur lors de la connexion avec e-mail", error);
    });
});


// Gérer la communication entre la fenêtre pop-up et la fenêtre principale
window.addEventListener('message', (event) => {
  // Vérifiez que l'origine du message est sûre (spécifiez le domaine de votre application)
  if (event.origin !== 'https://seudominio.com') {
    return; // Ignorer les messages provenant de sources inconnues
  }

  if (event.data.type === 'popupClosed') {
    // La fenêtre pop-up a été fermée
    console.log('Le pop-up a été fermé');
    // Traitez l'erreur ou d'autres actions ici si nécessaire
  } else if (event.data.type === 'authSuccess') {
    // Authentification réussie dans le pop-up
    console.log('Authentification réussie');
    // Rediriger l'utilisateur vers la page d'accueil
    window.location.href = 'home.html';
  } else if (event.data.type === 'authError') {
    // Erreur d'authentification depuis le pop-up
    console.log('Erreur d\'authentification');
  }
});
