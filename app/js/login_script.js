import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { config } from "./config.js"

const app = initializeApp(config.firebase);
const auth = getAuth(app);

async function getUserProfile(token) {
  const response = await fetch(`${config.vingtaine.webapiBaseUrl}/v1/users`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status == 404) {
      swal("Compte introuvable", "Veuillez utiliser l'application mobile pour créer votre compte.", "info");
    }
    else {
      throw new Error("Erreur lors de l'obtention du profil");
    }
  }

  var body = await response.json();

  return body;
}

async function handleSignIn(auth) {
  const user = auth.currentUser;
  const token = await user.getIdToken();

  try {
    var profile = await getUserProfile(token);

    if (profile.id) {
      window.location.href = 'home.html';
    }
  } catch (error) {
    swal("Erreur", "Erreur de connexion, veuillez réssayer plus tard.", "error");
  }
}

document.getElementById("google-login").addEventListener("click", () => {

  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(() => {
      handleSignIn(auth);
    })
    .catch(error => {
      swal("Erreur", "Erreur de connexion, veuillez réssayer plus tard.", "error");
      console.error("Erreur lors de la connexion avec Google", error);
    });
});

document.getElementById("facebook-login").addEventListener("click", () => {
  const provider = new FacebookAuthProvider();

  signInWithPopup(auth, provider)
    .then(() => {
      handleSignIn(auth);
    })
    .catch(error => {
      swal("Erreur", "Erreur de connexion, veuillez réssayer plus tard.", "error");
      console.error("Erreur lors de la connexion Facebook", error);
    });
});

document.getElementById("user-pwd-login").addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  var isValid = email && password;

  if (!isValid) {
    swal("Veuillez saisir le nom d'utilisateur et le mot de passe.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      handleSignIn(auth);
    })
    .catch(error => {
      swal("Nom d'utilisateur ou mot de passe invalide.");
      console.error("Erreur lors de la connexion avec e-mail", error);
    });
});