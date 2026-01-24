import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../api/axios.ts";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  avatar?: File | null;
}

const Register = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Register must be used inside AuthProvider");
  }

  const { login } = authContext;

  const initialValues: RegisterFormValues = {
    username: "",
    email: "",
    password: "",
    avatar: null,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters")
      .required("Password required"),
    avatar: Yup.mixed<File>()
      .nullable()
      .test("fileSize", "Max 2MB", (value) => !value || value.size <= 2 * 1024 * 1024)
      .test("fileType", "Only jpeg/png", (value) =>
        !value || ["image/jpeg", "image/png"].includes(value.type)
      ),
  });

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (values.avatar) formData.append("avatar", values.avatar);

      const res = await axios.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { token, user } = res.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        login(user);
        navigate("/home");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error during registration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Join StreetCats</h2>
        <p className="text-gray-500 text-sm">Start helping cats today!</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <Field
                  id="username"
                  name="username"
                  placeholder="Username"
                  className={`w-full pl-4 pr-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.username && touched.username ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-amber-400'
                    }`}
                />
              </div>
              <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email && touched.email ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-amber-400'
                  }`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password && touched.password ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-amber-400'
                  }`}
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} className="w-12 h-12 rounded-full object-cover border-2 border-amber-200" alt="Preview" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl"></div>
                  )}
                </div>
                <label className="flex-1">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl py-2 px-3 text-center cursor-pointer hover:bg-amber-50 transition-colors">
                    <span className="text-xs text-gray-600 font-medium">Upload Photo</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setFieldValue("avatar", file);
                      setAvatarPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-xs text-amber-600 font-semibold hover:underline"
              >
                Sign In Instead
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-8 pt-6 border-t border-gray-100">
        <p className="text-[10px] text-center text-gray-400 leading-relaxed px-4">
          By subscribing, you accept our{" "}
          <a href="/terms" className="text-amber-500 hover:underline font-medium">Terms of Service</a>
          {" "}and our{" "}
          <a href="/privacy" className="text-amber-500 hover:underline font-medium">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;
