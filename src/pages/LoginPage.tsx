import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "../store/authStore";
import { loginUser } from "../api/client";
import { loginSchema } from "../schemas/authSchema";
import type { LoginFormValues } from "../schemas/authSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  // The same useMutation the submissions form uses. Logging in is a
  // POST that changes something on the server, so it is a mutation
  // and not a query.
  const logIn = useMutation({
    mutationFn: loginUser,
    onSuccess: (reply) => {
      // The token came from the API this time. The store just keeps it.
      setSession(reply.token, reply.user.name);
      navigate("/submissions");
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    logIn.mutate(values);
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={errors.email ? true : undefined}
            placeholder="juan@dlsl.edu.ph"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          {/* type="password" does two things: hides the characters as
          they are typed, and keeps the value out of autofill
          history. */}
          <Input
            id="password"
            type="password"
            {...register("password")}
            aria-invalid={errors.password ? true : undefined}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={logIn.isPending}
          className="justify-self-start"
        >
          {logIn.isPending ? "Signing in..." : "Log In"}
        </Button>
      </form>

      {/* The API's own sentence, not one written here. A wrong password
      and an unknown email both produce "Email or password is
      incorrect" -- deliberately the same message for both. */}
      {logIn.isError && (
        <p className="mt-4 text-sm text-red-700">{logIn.error.message}</p>
      )}

      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        No account yet?{" "}
        <Link to="/register" className="font-semibold text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
