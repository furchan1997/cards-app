import { useFormik } from "formik";
import Input from "../Components/Common/input";
import PageHeaders from "../Components/Common/pageHeaders";
import cardsService from "../Services/cardsService";
import Joi from "joi";
import { emailRegex, phoneRegex, webRegex } from "../rejex";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function CreateCard() {
  // ייבוא ההוקס והרכיבים הנדרשים
  const navigate = useNavigate(); // הוק שמאפשר ניווט בתוכנית לרוטה שונה
  const [serverError, setServerError] = useState(); // מצב לניהול שגיאות מהשרת

  // הגדרת Formik לניהול הטופס
  const CreatCard = useFormik({
    validateOnMount: true, // אימות הערכים בטופס כאשר הוא נטען
    initialValues: {
      // ערכים התחלתיים עבור השדות בטופס
      title: "",
      subtitle: "",
      description: "",
      phone: "",
      email: "",
      web: "",
      image: {
        url: "",
        alt: "",
      },
      address: {
        state: "",
        country: "",
        city: "",
        street: "",
        houseNumber: "",
        zip: undefined, // הגדרת ערך התחלתי עבור zip ל-undefined
      },
    },

    // פונקציית אימות המוודאת את הערכים בטופס לפי סכמת Joi
    validate(values) {
      const schema = Joi.object({
        // הגדרת סכמת Joi לאימות
        title: Joi.string().min(2).max(256).label("title").required(), // הכותרת חייבת להיות מחרוזת, דרושה, ומוגבלת באורך
        subtitle: Joi.string().min(2).max(256).label("subtitle").required(), // אימות דומה עבור הכותרת המשנית
        description: Joi.string() // תיאור חייב להיות מחרוזת
          .min(2)
          .max(1024)
          .label("description")
          .required(),
        phone: Joi.string() // טלפון חייב להיות מחרוזת
          .min(9)
          .max(11)
          .label("phone")
          .pattern(phoneRegex) // אימות לפי ביטוי רגולרי לטלפון
          .rule({ message: 'phone" must be a standard Israeli phone number' }) // הודעת שגיאה מותאמת
          .required(),
        email: Joi.string() // אימות עבור אימייל
          .min(5)
          .label("email")
          .pattern(emailRegex) // אימות לפי ביטוי רגולרי לאימייל
          .rule({ message: '"email" must be a standard email' })
          .required(),
        web: Joi.string() // אימות עבור אתר אינטרנט
          .min(14)
          .label("web")
          .pattern(webRegex) // אימות לפי ביטוי רגולרי לכתובת אתר
          .rule({ message: ' "web" must be a standard URL' })
          .allow(null, ""), // מאפשר גם ערכים ריקים
        image: Joi.object({
          // אימות עבור תמונה
          url: Joi.string()
            .min(14)
            .label("url")
            .pattern(webRegex) // אימות לכתובת URL
            .rule({ message: " 'image/url' must be a standard URL" })
            .allow(null, ""),
          alt: Joi.string().min(2).max(256).label("alt").allow(null, ""), // תיאור התמונה
        }),
        address: Joi.object({
          // אימות עבור כתובת
          state: Joi.string().label("state").allow(null, ""), // מדינה (אופציונלי)
          country: Joi.string().label("country").required(), // מדינה חייבת להיות קיימת
          city: Joi.string().label("city").required(), // עיר חייבת להיות קיימת
          street: Joi.string().min(2).label("street").required(), // רחוב חייב להיות קיים ומינימלי באורך
          houseNumber: Joi.number().label("houseNumber").required(), // מספר הבית חייב להיות מספר
          zip: Joi.alternatives() // אימות עבור קוד דואר
            .try(Joi.number().label("zip code"), Joi.string().allow("", null)) // מאפשר מספר או מחרוזת ריקה
            .optional(),
        }),
      });

      const { error } = schema.validate(values, { abortEarly: false }); // אימות הערכים

      let errors = {};
      if (!error) return null; // אם לא קיימת שגיאה, מחזירים null

      // אם קיימות שגיאות, נוסיף אותן לאובייקט errors
      for (const detail of error.details) {
        const where = detail.path.join("."); // מיקום השגיאה
        const what = detail.message; // הודעת השגיאה
        errors[where] = what; // שמירת השגיאה באובייקט
      }
      return errors; // מחזירים את השגיאות
    },

    // פונקציה המופעלת כאשר הטופס נשלח
    async onSubmit(values) {
      if (values.address.zip === "") {
        values.address.zip = undefined; // אם קוד הדואר ריק, נשנה אותו ל-undefined
      }

      try {
        await cardsService.createCard(values); // שליחת הבקשה לשרת ליצירת כרטיס
        navigate(`/my-cards`); // ניווט לדף הכרטיסים שלי
        toast.success("The card was created successfully");
      } catch (err) {
        if (err.response?.status === 400) {
          // אם קיבלו שגיאת 400 מהשרת
          const errorMessage = err.response.data;
          setServerError(errorMessage); // עדכון מצב השגיאה בשרת
          toast.error(errorMessage); // הצגת הודעת השגיאה ב-Toast
        }
      }
    },
  });

  return (
    <div className="pb-5">
      <PageHeaders
        title="Creat card"
        description="craer a new card for your biz it's for free"
      />
      <div className="container my-5 ">
        <form onSubmit={CreatCard.handleSubmit} autoComplete="off" noValidate>
          {serverError && (
            <div className="alert alert-danger">{serverError}</div>
          )}
          <div className="row">
            <div className="col-md-6">
              <Input
                {...CreatCard.getFieldProps("title")}
                error={CreatCard.touched?.title && CreatCard.errors.title}
                label="title"
                type="text"
                placeholder="some title..."
                name="title"
                required
              />
              <Input
                {...CreatCard.getFieldProps("subtitle")}
                error={CreatCard.touched?.subtitle && CreatCard.errors.subtitle}
                label="Subtitle"
                type="text"
                placeholder="some subtitle..."
                name="subtitle"
                required
              />
              <Input
                {...CreatCard.getFieldProps("description")}
                error={
                  CreatCard.touched?.description && CreatCard.errors.description
                }
                label="Description"
                type="text"
                placeholder="some description..."
                name="description"
                required
              />
              <Input
                {...CreatCard.getFieldProps("phone")}
                error={CreatCard.touched?.phone && CreatCard.errors.phone}
                label="Phone"
                type="phone"
                placeholder="some phone..."
                name="phone"
                required
              />
              <Input
                {...CreatCard.getFieldProps("email")}
                error={CreatCard.touched?.email && CreatCard.errors.email}
                label="Email"
                type="email"
                placeholder="exmple@email.com"
                name="email"
                required
              />

              <Input
                {...CreatCard.getFieldProps("web")}
                error={CreatCard.touched?.web && CreatCard.errors.web}
                label="Web"
                type="text"
                placeholder="www.bing.com"
                name="web"
              />
              <Input
                {...CreatCard.getFieldProps("image.url")}
                error={
                  CreatCard.touched.image?.url && CreatCard.errors["image.url"]
                }
                label="Url"
                type="text"
                placeholder="www.image.com"
                name="image.url"
              />
              <Input
                {...CreatCard.getFieldProps("image.alt")}
                error={
                  CreatCard.touched.image?.alt && CreatCard.errors["image.alt"]
                }
                label="Alt"
                type="text"
                placeholder="Some Alternative"
                name="image.alt"
              />
            </div>
            <div className="col-md-6 pb-5">
              <Input
                {...CreatCard.getFieldProps("address.state")}
                error={
                  CreatCard.touched.address?.state &&
                  CreatCard.errors["address.state"]
                }
                label="State"
                type="text"
                placeholder="IL"
                name="address.state"
              />
              <Input
                {...CreatCard.getFieldProps("address.country")}
                error={
                  CreatCard.touched.address?.country &&
                  CreatCard.errors["address.country"]
                }
                label="country"
                type="text"
                placeholder="Israel"
                name="address.country"
                required
              />
              <Input
                {...CreatCard.getFieldProps("address.city")}
                error={
                  CreatCard.touched.address?.city &&
                  CreatCard.errors["address.city"]
                }
                label="City"
                type="text"
                placeholder="Netanya"
                name="address.city"
                required
              />
              <Input
                {...CreatCard.getFieldProps("address.street")}
                error={
                  CreatCard.touched.address?.street &&
                  CreatCard.errors["address.street"]
                }
                label="Street"
                type="text"
                placeholder="Balfur"
                name="address.street"
                required
              />
              <Input
                {...CreatCard.getFieldProps("address.houseNumber")}
                error={
                  CreatCard.touched.address?.houseNumber &&
                  CreatCard.errors["address.houseNumber"]
                }
                label="HouseNumber"
                type="number"
                placeholder="10"
                name="address.houseNumber"
                required
              />
              <Input
                {...CreatCard.getFieldProps("address.zip")}
                error={
                  CreatCard.touched.address?.zip &&
                  CreatCard.errors["address.zip"]
                }
                label="Zip"
                placeholder="1000"
                name="address.zip"
              />
              <button
                type="submit"
                className="btn btn-primary mt-3"
                disabled={!CreatCard.isValid || CreatCard.isSubmitting}
              >
                Craet card
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCard;
