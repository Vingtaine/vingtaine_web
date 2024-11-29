// Code dans la fenêtre pop-up (authWindow)

// Écoute de l'événement de chargement de la fenêtre pop-up
window.addEventListener('load', () => {
    // Récupérer l'origine de la fenêtre principale (peut être dynamique)
    const origin = document.getElementById('parentOrigin').textContent;
    
    // Informer que la fenêtre pop-up est prête
    window.opener.postMessage({ type: 'popupReady' }, origin); 
  
    // Écouter l'interaction de l'utilisateur dans la fenêtre pop-up (par exemple, authentification réussie)
    document.getElementById('auth-success').addEventListener('click', () => {
      // Envoyer les données d'authentification vers la fenêtre principale
      const authData = { username: 'user123', email: 'user@example.com' };
      window.opener.postMessage({ type: 'authSuccess', data: authData }, origin);
      window.close(); // Fermer la fenêtre pop-up après l'authentification réussie
    });
  
    // Si l'utilisateur ferme la fenêtre pop-up
    window.addEventListener('beforeunload', () => {
      window.opener.postMessage({ type: 'popupClosed' }, origin);
    });
  });
  