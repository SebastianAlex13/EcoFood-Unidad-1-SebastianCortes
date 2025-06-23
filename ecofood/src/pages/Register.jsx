import { useState } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { saveUserData } from "../services/userService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const tipo = "cliente";
  const navigate = useNavigate();

  const validarContraseña = (contraseña) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(contraseña);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarContraseña(password)) {
      Swal.fire("Contraseña débil", "Debe tener al menos 6 caracteres y combinar letras y números.", "warning");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      await saveUserData(cred.user.uid, { nombre, email, direccion, comuna, telefono, tipo });
      Swal.fire("Verifica tu correo", "Se ha enviado un email de verificación.", "info");
      navigate("/login");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo completar el registro.", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Nombre completo</label>
          <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Correo electrónico</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Dirección</label>
          <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Comuna</label>
          <input type="text" className="form-control" value={comuna} onChange={(e) => setComuna(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Teléfono (opcional)</label>
          <input type="tel" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-success">Registrar</button>
      </form>
    </div>
  );
}
