import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../services/authService";

function VerifyEmail() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        setMessage(data.message);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to verify your email."
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {loading ? (
          <>
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <h1 className="text-2xl font-bold text-gray-900">
              Verifying your email...
            </h1>

            <p className="mt-2 text-gray-500">
              Please wait while we verify your email address.
            </p>
          </>
        ) : message ? (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
              ✓
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Email Verified!
            </h1>

            <p className="mt-3 text-gray-500">
              {message}
            </p>

            <Link
              to="/auth"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              !
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Verification Failed
            </h1>

            <p className="mt-3 text-gray-500">
              {error}
            </p>

            <Link
              to="/auth"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;