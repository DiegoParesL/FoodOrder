import { useEffect, useState } from "react";



function Home({ onClickMenu, onLogout,user}) {
  const handleLogout = async () => {
  try {
    const csrfRes = await fetch("/api/auth/csrf/", {
      credentials: "include",
    });
    const csrfData = await csrfRes.json();

    const response = await fetch("/api/auth/logout/", {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfData.csrfToken,
      },
    });

    const data = await response.json();
    if (response.ok) {
      onLogout(); // Limpia el estado del usuario
      alert("Sesión cerrada");
    } else {
      alert("Error al cerrar sesión: " + data.message);
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("Error al cerrar sesión");
  }
};
  return (
    <div className="home">
      <h1>Menú principal</h1>
      {user && <button onClick={() => onClickMenu("meals")}>Lista de Comidas</button>}
      {!user && <button onClick={() => onClickMenu("login")}>Iniciar sesión</button>}
      {!user && <button onClick={() => onClickMenu("register")}>Registrarse</button>}
      {user && <button onClick={() => onClickMenu("pedidos")}>Mis pedidos</button>}
      {user && <button onClick={handleLogout}>Cerrar sesión</button>}      
    </div>
  );
}

export default Home;
