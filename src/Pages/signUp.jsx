import PageHeaders from "../Components/Common/pageHeaders";
import Logo from "../Components/logo";
import Input from "../Components/Common/input";
import { useFormik } from "formik";
import Joi, { boolean, required } from "joi";
import { passwordRegex, phoneRegex, emailRegex } from "../rejex";
import { useState } from "react";
import { useAuth } from "../context/auth.context";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  // מצב לשמירת הודעות שגיאה
  const [errMsg, setErrMsg] = useState("");
  // קבלת פרטי המשתמש ופונקציית ההרשמה מהקונטקסט
  const { user, signUp } = useAuth();
  const navigate = useNavigate(); // הפניית ההוק לניווט בין העמודים

  // שימוש ב- useFormik לניהול טופס ההרשמה
  const form = useFormik({
    validateOnMount: true, // מאפשר ולידציה כבר בעת טעינת הטופס

    // ערכים התחלתיים לכל השדות בטופס
    initialValues: {
      name: {
        first: "", // שם פרטי
        middle: "", // שם אמצעי
        last: "", // שם משפחה
      },
      phone: "", // טלפון
      email: "", // דואר אלקטרוני
      password: "", // סיסמה
      image: {
        url: "", // כתובת התמונה
        alt: "", // תיאור התמונה
      },
      address: {
        state: "", // מדינה
        country: "", // מדינה
        city: "", // עיר
        street: "", // רחוב
        houseNumber: "", // מספר בית
        zip: "", // מיקוד
      },
      isBusiness: false, // האם המשתמש הוא עסק
    },
    // פונקציית ולידציה עבור הטופס
    validate(values) {
      const schema = Joi.object({
        name: Joi.object({
          first: Joi.string().min(2).max(256).required().label("First name"), // שם פרטי
          middle: Joi.string()
            .min(2)
            .max(256)
            .label("Middle name")
            .allow(null, ""), // שם אמצעי (אופציונלי)
          last: Joi.string().min(2).max(256).required().label("Last name"), // שם משפחה
        }),
        phone: Joi.string()
          .min(9)
          .max(11)
          .pattern(phoneRegex) // חוק עבור טלפון
          .rule({ message: '"phone" must be a standard Israeli phone number' }) // הודעת שגיאה עבור טלפון לא תקני
          .required()
          .label("Phone number"), // תווית עבור טלפון
        email: Joi.string()
          .min(5)
          .pattern(emailRegex) // חוק עבור דואר אלקטרוני
          .rule({ message: '"email" must be a standard email' }) // הודעת שגיאה עבור דואר אלקטרוני לא תקני
          .required()
          .label("Email"), // תווית עבור דואר אלקטרוני
        password: Joi.string()
          .min(7)
          .max(20)
          .pattern(passwordRegex) // חוק עבור סיסמה
          .rule({
            message:
              '"password" must be at least nine characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-', // הודעת שגיאה עבור סיסמה לא תקנית
          })
          .required()
          .label("Password"), // תווית עבור סיסמה
        image: Joi.object({
          url: Joi.string()
            .min(14)
            .rule({ message: '"image url" must be a standard URL' }) // הודעת שגיאה עבור כתובת תמונה לא תקנית
            .label("url")
            .allow(null, ""), // מאפשר ערך null
          alt: Joi.string().min(2).max(20).label("Alternative").allow(null, ""), // תיאור תמונה (אופציונלי)
        }),
        address: Joi.object({
          state: Joi.string().min(2).max(256).label("State").allow(null, ""), // מדינה (אופציונלי)
          country: Joi.string().min(2).max(256).required().label("Country"), // מדינה (חובה)
          city: Joi.string().min(2).max(256).required().label("City"), // עיר (חובה)
          street: Joi.string().min(2).max(256).required().label("Street"), // רחוב (חובה)
          houseNumber: Joi.number().min(1).required().label("House number"), // מספר בית (חובה)
          zip: Joi.number().min(1).required().label("Zip"), // מיקוד (חובה)
        }),
        isBusiness: Joi.boolean().required(), // האם מדובר בעסק (חובה)
      });

      const { error } = schema.validate(values, { abortEarly: false }); // ולידציה של הערכים
      let errors = {}; // אובייקט לאחסון שגיאות

      if (!error) return null; // אם אין שגיאות, מחזיר null

      // חזרה על שגיאות והכנסתן לאובייקט
      for (const detail of error.details) {
        const path = detail.path.join("."); // מסלול השגיאה
        errors[path] = detail.message; // שמירת הודעת השגיאה
      }
      return errors; // מחזיר את השגיאות
    },
    // פונקציה שתתבצע בעת שליחת הטופס
    async onSubmit(values) {
      try {
        await signUp(values); // קריאה לפונקציית ההרשמה
        navigate("/sign-in"); // ניווט לעמוד הכניסה לאחר הצלחה
        toast.success("Registration was successfully completed");
      } catch (err) {
        // טיפול בשגיאות
        if (err.response?.status === 400) {
          const errorMessage = err.response.data;
          setErrMsg(errorMessage); // שמירת הודעת שגיאה אם יש שגיאה 400
          toast.error(errorMessage);
        }
      }
    },
  });

  // פונקציה לטיפול בשינוי בתיבת סימון
  const handleCheckboxChange = (e) => {
    form.setFieldValue(e.target.name, e.target.checked); // מעדכן את ערך תיבת הסימון
  };

  // אם המשתמש כבר מחובר, מעביר אותו לעמוד הבית
  if (user) {
    return <Navigate to="/" />;
  }
  return (
    <div className="pb-5">
      <PageHeaders
        title="Sign up"
        description={<> Sign up today to {<Logo />} it’s free </>}
      />

      <div className="container pb-5 my-5 ">
        <form onSubmit={form.handleSubmit} noValidate autoComplete="off">
          {errMsg && <div className="alert alert-danger">{errMsg}</div>}

          <div className="row">
            <div className="col-md-6">
              <Input
                {...form.getFieldProps("name.first")}
                error={form.touched.name?.first && form.errors["name.first"]}
                type="text"
                label="First name"
                placeholder="Ariel"
                name="name.first"
                required
              />
              <Input
                {...form.getFieldProps("name.middle")}
                error={form.touched.name?.middle && form.errors["name.middle"]}
                type="text"
                label="Middle name"
                placeholder="Haim"
                name="name.middle"
              />
              <Input
                {...form.getFieldProps("name.last")}
                error={form.touched.name?.last && form.errors["name.last"]}
                type="text"
                label="Last name"
                placeholder="Ben-Or"
                name="name.last"
                required
              />
              <Input
                {...form.getFieldProps("phone")}
                error={form.touched.phone && form.errors.phone}
                type="text"
                label="Phone"
                placeholder="051-111-1111"
                name="phone"
                required
              />
              <Input
                {...form.getFieldProps("email")}
                error={form.touched.email && form.errors.email}
                type="email"
                label="Email"
                placeholder="example@email.com"
                name="email"
                required
              />
              <Input
                {...form.getFieldProps("password")}
                error={form.touched.password && form.errors.password}
                type="password"
                label="Password"
                placeholder="password"
                name="password"
                required
              />
            </div>
            <div className="col-md-6">
              <Input
                {...form.getFieldProps("image.url")}
                error={form.touched.image?.url && form.errors["image.url"]}
                type="text"
                label="Image"
                id="image"
                name="image.url"
              />

              <Input
                {...form.getFieldProps("image.alt")}
                error={form.touched.image?.alt && form.errors["image.alt"]}
                type="text"
                label="Image alt"
                id="alt"
                name="image.alt"
              />
              <Input
                {...form.getFieldProps("address.state")}
                error={
                  form.touched.address?.state && form.errors["address.state"]
                }
                type="text"
                label="State"
                placeholder="IL"
                name="address.state"
              />
              <Input
                {...form.getFieldProps("address.country")}
                error={
                  form.touched.address?.country &&
                  form.errors["address.country"]
                }
                type="text"
                label="Country"
                placeholder="Israel"
                name="address.country"
                required
              />
              <Input
                {...form.getFieldProps("address.city")}
                error={
                  form.touched.address?.city && form.errors["address.city"]
                }
                type="text"
                label="City"
                placeholder="Netanya"
                name="address.city"
                required
              />
              <Input
                {...form.getFieldProps("address.street")}
                error={
                  form.touched.address?.street && form.errors["address.street"]
                }
                type="text"
                label="Street"
                placeholder="Herzel"
                name="address.street"
                required
              />
              <Input
                {...form.getFieldProps("address.houseNumber")}
                error={
                  form.touched.address?.houseNumber &&
                  form.errors["address.houseNumber"]
                }
                type="number"
                label="House number"
                placeholder="32"
                name="address.houseNumber"
                required
              />
              <Input
                {...form.getFieldProps("address.zip")}
                error={form.touched.address?.zip && form.errors["address.zip"]}
                type="number"
                label="Zip"
                placeholder="3422221"
                name="address.zip"
                required
              />
              <Input
                {...form.getFieldProps("isBusiness")}
                type="checkbox"
                label="I'm a biz"
                name="isBusiness"
                onChange={handleCheckboxChange}
              />

              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={!form.isValid || form.isSubmitting}
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
