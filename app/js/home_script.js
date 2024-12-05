import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, deleteUser, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { config } from "./config.js"

const app = initializeApp(config.firebase);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    console.log("Aucun utilisateur connecté, redirection...");
    window.location.href = "/";
  }
});

document.getElementById("logout").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "/";
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    swal("Erreur", "Une erreur est survenue lors de la déconnexion. Veuillez réessayer ou fermer la fenêtre.", "error");
  }
})

async function deleteAccountFromBackend(token) {
  const response = await fetch(`${config.vingtaine.webapiBaseUrl}/v1/users`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify("suppression via site")
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression du compte dans le backend.");
  }
}

document.getElementById("delete-account").addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    window.location.href = "/";
    return;
  }

  const confirmation = await swal({
    title: "Attention!",
    text: "\n\nVoici les données qui seront supprimées:\n\nVotre compte, nom et prénom, addresse courriel, ainsi que vos favoris dans l'app.\n\nÊtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  });

  if (!confirmation) return;

  try {

    AmagiLoader.show();
    
    const token = await user.getIdToken();
    await deleteAccountFromBackend(token);
    await deleteUser(user);
    await swal("Compte supprimé", "Votre compte a été supprimé avec succès.", "success");
    window.location.href = "/";

    AmagiLoader.hide();
    
  } catch (error) {
    AmagiLoader.hide();
    console.error("Erreur lors de la suppression :", error);
    swal("Erreur", "Impossible de supprimer le compte. Veuillez réessayer plus tard.", "error");
  }
});