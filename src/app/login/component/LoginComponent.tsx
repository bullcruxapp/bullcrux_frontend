'use client'

import { useState } from "react";
import { TextInputComponent } from "../../../components/TextInputComponent";
import { useLoading } from "hooks/useLoading";
import { loginService } from "services/user.service";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useError } from "hooks/useError";

interface LoginComponentProps {
}

const LoginComponent = (props: LoginComponentProps) => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { isLoading, startLoading, stopLoading } = useLoading();
  const { error, setError } = useError();
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    startLoading();
    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      }
      );

      if (response?.error) {
        setError("Invalid email or password");
        stopLoading();
        return;
      }

      setError(null);
      router.push('/');
      stopLoading();

    }
    catch (error) {
      console.error('Login error:', error);
      stopLoading();
    }
  }
  return (
    <div>
      {
        isLoading ? <p>Loading...</p> :
          <>

            <h1>Bienvenido!</h1>
            <p>Welcome back, we missed you</p>
            <form onSubmit={handleLogin}>

              <TextInputComponent
                placeholder="email"
                value={email}
                onChange={setEmail}
                className="border p-2"
                label="Usuario"
              />
              <TextInputComponent
                placeholder="Password"
                value={password}
                onChange={setPassword}
                className="border p-2 mt-4"
                label="Contraseña"
              />

              <button type="submit" className="bg-blue-500 text-white p-2 mt-4 w-full">
                Login
              </button>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </>

      }
    </div>
  )
}

export default LoginComponent