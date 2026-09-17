"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoginForm from "./LoginForm";

export default function AdminGuard({ children }) {
  const [session, setSession] = useState(undefined); // undefined = cargando

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="adminwrap">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="adminwrap">
        <div className="pagehero">
          <h1>Panel de administración</h1>
          <p className="lede">Ingresa con tu correo y contraseña para gestionar tus propiedades.</p>
        </div>
        <LoginForm onSuccess={() => {}} />
      </div>
    );
  }

  return children;
}
