let auth0 = null;

async function initAuth0() {
  auth0 = await createAuth0Client({
    domain: 'dev-1mz20nt11b6fblch.us.auth0.com',
    client_id: 'N9HquBJSSXDFrekjy0vyetc0n123U25J',
    audience: 'https://minha-api', // <- O mesmo usado no backend!
    cacheLocation: 'localstorage' // opcional, mantém login após reload
  });

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();
    document.getElementById('user').innerText = `Olá, ${user.name}`;
    loadProtectedData(); // carrega dados com token
  } else {
    // verifica retorno do Auth0 após login
    const query = window.location.search;
    if (query.includes('code=') && query.includes('state=')) {
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, '/');
      const user = await auth0.getUser();
      document.getElementById('user').innerText = `Olá, ${user.name}`;
      loadProtectedData();
    }
  }
}

window.onload = initAuth0;



async function login() {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin
    });
  }
  
  function logout() {
    auth0.logout({
      returnTo: window.location.origin + "login.html"
    });
  }


  async function loadProtectedData() {
    const token = await auth0.getTokenSilently();
    const res = await fetch('http://localhost:3000/api/data', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    document.getElementById('api-data').innerText = JSON.stringify(data);
  }
  