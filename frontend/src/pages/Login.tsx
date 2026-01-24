import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth.ts";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/home";

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email non valida")
      .required("L'email è obbligatoria"),
    password: Yup.string()
      .min(5, "La password deve avere almeno 5 caratteri")
      .required("La password è obbligatoria"),
  });

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Street<span className="text-amber-400">Cats</span>
        </h1>
        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-1">
          Accesso Comandante
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-shake">
          {serverError}
        </div>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError(null);
          try {
            const response = await api.post("/auth/login", values);
            const { user, token } = response.data;

            login(user, token);

            navigate(from, { replace: true });
          } catch (err: any) {
            setServerError(err.response?.data?.message || "Errore durante il login");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-5">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all ${errors.email && touched.email
                  ? "border-red-300 bg-red-50"
                  : "border-gray-100 focus:border-amber-400 bg-gray-50"
                  }`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 ml-2 font-medium" />
            </div>

            <div>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all ${errors.password && touched.password
                  ? "border-red-300 bg-red-50"
                  : "border-gray-100 focus:border-amber-400 bg-gray-50"
                  }`}
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1 ml-2 font-medium" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  CARICAMENTO...
                </span>
              ) : (
                "ACCEDI"
              )}
            </button>
          </Form>
        )}
      </Formik>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Non sei ancora dei nostri?{" "}
          <Link to="/register" className="text-amber-500 font-bold hover:text-orange-500 transition-colors">
            Registrati ora
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
