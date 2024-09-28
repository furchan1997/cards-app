import Joi from "joi";
import Input from "../Components/Common/input";
import { useFormik } from "formik";
import { useState } from "react";
import PageHeaders from "../Components/Common/pageHeaders";
import Logo from "../Components/logo";
import { passwordRegex, emailRegex } from "../rejex";
import { useAuth } from "../context/auth.context";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignIn() {
  // מצב לשמירת הודעת השגיאה אם תתרחש
  const [errMsg, setErrMsg] = useState("");

  // שואבים את המידע על המשתמש ואת פונקציית ההתחברות מההקשר של האותנטיקציה
  const { user, login } = useAuth();

  // פונקציה לניווט בין דפים באפליקציה
  const navigate = useNavigate();

  // הגדרת טופס באמצעות useFormik לניהול קלטי המשתמש
  const form = useFormik({
    // מאפשר אימות כאשר הטופס מוטען
    validateOnMount: true,

    // ערכים התחלתיים עבור השדות של הטופס
    initialValues: {
      email: "", // שדה האימייל, ריק בהתחלה
      password: "", // שדה הסיסמה, ריק בהתחלה
    },

    // פונקציית האימות של הטופס
    validate(values) {
      // הגדרת סכמת האימות בעזרת Joi
      const schema = Joi.object({
        email: Joi.string()
          .min(5) // אורך מינימלי של 5 תווים
          .pattern(emailRegex) // תבנית עבור אימייל תקני
          .rule({ message: '"email" must be a standard email' }) // הודעת שגיאה מותאמת
          .required() // שדה חובה
          .label("Email"), // תווית עבור השדה

        password: Joi.string()
          .min(7) // אורך מינימלי של 7 תווים
          .max(20) // אורך מקסימלי של 20 תווים
          .pattern(passwordRegex) // תבנית עבור סיסמה תקנית
          .rule({
            message:
              '"password" must be at least nine characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-', // הודעת שגיאה מותאמת
          })
          .required() // שדה חובה
          .label("Password"), // תווית עבור השדה
      });

      // אימות הערכים שנשלחו על ידי הסכמת Joi
      const { error } = schema.validate(values, { abortEarly: false });
      let errors = {}; // אובייקט לשמירת שגיאות

      // אם אין שגיאות, מחזירים null
      if (!error) return null;

      // אם יש שגיאות, ממלאים את אובייקט השגיאות
      for (const detali of error.details) {
        const path = detali.path; // מסלול השדה שגרם לשגיאה
        errors[path] = detali.message; // הודעת השגיאה
      }
      return errors; // מחזירים את אובייקט השגיאות
    },

    // פונקציית ההגשה של הטופס
    async onSubmit(values) {
      try {
        // מנסים לבצע התחברות עם הערכים שנשלחו מהטופס
        await login(values);
        navigate("/"); // אם הצליח, מנווטים לדף הבית
        toast.success("you loged in");
      } catch (err) {
        // אם קיבלו שגיאה עם קוד 400
        if (err.response?.status === 400) {
          const errorMessage = err.response.data;
          setErrMsg(errorMessage); // מעדכנים את הודעת השגיאה
          toast.error(errorMessage);
        }
      }
    },
  });

  // אם המשתמש כבר מחובר, מנווטים אותו לדף הבית
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <PageHeaders
        title="Sign in"
        description={<> Sign up today to {<Logo />} it’s free </>}
      />

      <div className="my-5 container">
        <form onSubmit={form.handleSubmit} noValidate autoComplete="off">
          <Input
            label="Email"
            {...form.getFieldProps("email")}
            name="email"
            type="email"
            error={form.touched.email && form.errors.email}
          />
          <Input
            label="Password"
            {...form.getFieldProps("password")}
            name="password"
            type="password"
            error={form.touched.password && form.errors.password}
          />
          <button
            className="btn btn-primary mt-3"
            disabled={!form.isValid}
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
export default SignIn;
