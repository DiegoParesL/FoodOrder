import { useState, useEffect } from "react";

function RegisterPage({ onClickMenu }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [csrfToken, setToken] = useState(null);
  const [confirmar, setConfirmar] = useState(''); 

  useEffect(() => {
      fetchCsrfToken();
    }, []); 
  const fetchCsrfToken = async () => {
    try {
      
      const response = await fetch("/api/auth/csrf/", { 
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Error HTTP al obtener CSRF token: ${response.status} ${response.statusText}`,
          errorData
        );
        setMensaje("Error al cargar token de seguridad.");
        return null;
      }

      const data = await response.json();

      if (data && data.csrfToken) {
        setToken(data.csrfToken);
        return data.csrfToken;
      } else {
        setMensaje("Token de seguridad no encontrado en la respuesta.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener CSRF token (problema de red o parsing):", error);
      setMensaje("Error de conexión al cargar token de seguridad.");
      return null;
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmar) {
      alert('Las contraseñas no coinciden');
    }else{
	    let currentCsrfToken = csrfToken;
	    if (!currentCsrfToken) {
	      setMensaje("Token de seguridad no cargado. Intentando obtenerlo...");
	      currentCsrfToken = await fetchCsrfToken();
	      if (!currentCsrfToken) {
	        setMensaje("No se pudo obtener el token de seguridad. Intente de nuevo.");
	        return;
	      }
	    }

	    const response = await fetch("/api/auth/register/", {
	      credentials:'include',
	      method: "POST",
	      headers: {
	          "Content-Type": "application/json",
	          "X-CSRFToken": currentCsrfToken, 
	        },
	      body: JSON.stringify({ username:user, password:password })
	    });


	    
	    const data = await response.json();

	    if (data.success) {
	      setMensaje("Usuario registrado correctamente. Ahora inicia sesión.");
	      setTimeout(() => onClickMenu("login"), 2000);
	    } else {
	      setMensaje(data.message || "Error en el registro.");
	    }
	  };
     }
  return (
    <div className="formulario">
      <h2>Registro</h2>
      <button onClick={() => onClickMenu("home")}>Volver</button>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="name">Usuario</label>
          <input
            id="name"
            type="text"
            placeholder="Nombre de usuario"
            autoComplete="off"
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <label htmlFor="password1">Contraseña</label>
          <input
            id="password1"
            type="password"
            placeholder="Contraseña"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
	  <label htmlFor="password2">Confirmar Contraseña</label>
          <input
            id="password2"
            type="password"
            placeholder="Contraseña"
            autoComplete="new-password"
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />
          <button type="submit">Registrarse</button>
        </div>
      
        
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default RegisterPage;
