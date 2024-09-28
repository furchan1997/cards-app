import { useParams } from "react-router-dom";
import { useCard } from "../hooks/useCard";
import { useFormik } from "formik";
import Input from "../Components/Common/input";
import PageHeaders from "../Components/Common/pageHeaders";
import cardsService, { updateCard } from "../Services/cardsService";
import Joi from "joi";
import { emailRegex, phoneRegex, webRegex } from "../rejex";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function UpdataCards() {
  // קבלת מזהה הכרטיס מה-URL
  const { id } = useParams();
  // חיבור הכרטיס הקיים על פי המזהה
  const { card } = useCard(id);
  // הפונקציה לניהול ניווט בין עמודים
  const navigate = useNavigate();
  // מצב לשמירת הודעות שגיאה מהשרת
  const [serverError, setServerError] = useState("");
  // מצב לשמירת מצב הטעינה של הכרטיס
  const [loading, setLoading] = useState(true);

  // שימוש ב- useFormik לניהול הטופס לעריכת הכרטיס
  const EditeCard = useFormik({
    // מאפשר ולידציה כאשר הטופס נטען
    validateOnMount: true,

    // פונקציה לביצוע ולידציה על ערכי הטופס
    validate(values) {
      const schema = Joi.object({
        title: Joi.string().min(2).max(256).label("title").required(), // תווך עבור שם הכרטיס
        subtitle: Joi.string().min(2).max(256).label("subtitle").required(), // תווך עבור תת-כותרת
        description: Joi.string()
          .min(2)
          .max(1024)
          .label("description")
          .required(), // תווך עבור תיאור הכרטיס
        phone: Joi.string()
          .min(9)
          .max(11)
          .label("phone")
          .pattern(phoneRegex) // חוק עבור טלפון
          .rule({ message: 'phone" must be a standard Israeli phone number' }) // הודעת שגיאה עבור טלפון לא תקני
          .required(),
        email: Joi.string()
          .min(5)
          .label("email")
          .pattern(emailRegex) // חוק עבור דואר אלקטרוני
          .rule({ message: '"email" must be a standard email' }) // הודעת שגיאה עבור דואר אלקטרוני לא תקני
          .required(),
        web: Joi.string()
          .min(14)
          .label("web")
          .pattern(webRegex) // חוק עבור כתובת אתר
          .rule({ message: ' "web" must be a standard URL' }) // הודעת שגיאה עבור כתובת אתר לא תקנית
          .allow(null, ""), // מאפשר ערך null
        image: Joi.object({
          url: Joi.string()
            .min(14)
            .label("url")
            .pattern(webRegex) // חוק עבור כתובת התמונה
            .rule({ message: " 'image/url' must be a standard URL" }) // הודעת שגיאה עבור כתובת תמונה לא תקנית
            .allow(null, ""),
          alt: Joi.string().min(2).max(256).label("alt").allow(null, ""), // תיאור תמונה (אופציונלי)
        }),
        address: Joi.object({
          state: Joi.string().label("state").allow(null, ""), // מדינה (אופציונלי)
          country: Joi.string().label("country").required(), // מדינה (חובה)
          city: Joi.string().label("city").required(), // עיר (חובה)
          street: Joi.string().min(2).label("street").required(), // רחוב (חובה)
          houseNumber: Joi.number().label("houseNumber").required(), // מספר בית (חובה)
          zip: Joi.alternatives()
            .try(Joi.number().label("zip code"), Joi.string().allow("", null)) // מאפשר מספר או מחרוזת ריקה
            .optional(), // לא חובה
        }),
      });

      const { error } = schema.validate(values, { abortEarly: false }); // ביצוע הוולידציה

      let errors = {}; // אובייקט לאחסון שגיאות
      if (!error) return null; // אם אין שגיאות, מחזיר null

      for (const detail of error.details) {
        const where = detail.path.join("."); // מיקום השגיאה
        const what = detail.message; // הודעת השגיאה

        errors[where] = what; // שמירת השגיאה באובייקט
      }
      return errors; // מחזיר את השגיאות
    },
    // פונקציה שתתבצע בעת שליחת הטופס
    async onSubmit(values) {
      // אם מיקוד ריק, משנה ל-undefined
      if (values.address.zip === "") {
        values.address.zip = undefined; // או לשנות את הערך ל-null
      }

      try {
        // קריאה לפונקציה לעדכון הכרטיס
        await cardsService.updateCard(card._id, values);
        // ניווט לעמוד הכרטיסים שלי לאחר ההצלחה
        navigate(`/my-cards`);
        toast.success("The card has been successfully updated");
      } catch (err) {
        // טיפול בשגיאות
        toast.error(err);
        if (err.response?.status === 400) {
          setServerError(err.response.data); // שמירת הודעת שגיאה
        }
        toast.error(serverError);
      }
    },
  });

  // השפעה כאשר הכרטיס נטען
  useEffect(() => {
    if (card) {
      // מעדכן את ערכי הטופס על פי הכרטיס הקיים
      EditeCard.setValues({
        title: card.title || "", // שם הכרטיס
        subtitle: card.subtitle || "", // תת-כותרת
        description: card.description || "", // תיאור הכרטיס
        phone: card.phone || "", // טלפון
        email: card.email || "", // דואר אלקטרוני
        web: card.web || "", // כתובת אתר
        image: {
          url: card.image?.url || "", // כתובת התמונה
          alt: card.image?.alt || "", // תיאור התמונה
        },
        address: {
          state: card.address?.state || "", // מדינה
          country: card.address?.country || "", // מדינה
          city: card.address?.city || "", // עיר
          street: card.address?.street || "", // רחוב
          houseNumber: card.address?.houseNumber || "", // מספר בית
          zip: card.address?.zip || "", // מיקוד
        },
      });

      // מעדכן את loading רק בפעם הראשונה שהכרטיס נטען
      if (loading) {
        setLoading(false); // מעדכן את מצב הטעינה
      }
    }
  }, [card]); // שינינו את התלות ל-card בלבד

  // אם הכרטיס עדיין בטעינה, מציג הודעת טעינה
  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="pb-5">
      <PageHeaders title="Edit card" description="Edit your card as you wish" />
      <div className="container my-5 pb-5">
        <form onSubmit={EditeCard.handleSubmit} noValidate autoComplete="off">
          {serverError && (
            <div className="alert alert-danger">{serverError}</div>
          )}
          <div className="row">
            <div className="col-md-6">
              <Input
                {...EditeCard.getFieldProps("title")}
                error={EditeCard.touched?.title && EditeCard.errors.title}
                label="title"
                type="text"
                placeholder="some title..."
                name="title"
                required
              />
              <Input
                {...EditeCard.getFieldProps("subtitle")}
                error={EditeCard.touched?.subtitle && EditeCard.errors.subtitle}
                label="Subtitle"
                type="text"
                placeholder="some subtitle..."
                name="subtitle"
                required
              />
              <Input
                {...EditeCard.getFieldProps("description")}
                error={
                  EditeCard.touched?.description && EditeCard.errors.description
                }
                label="Description"
                type="text"
                placeholder="some description..."
                name="description"
                required
              />
              <Input
                {...EditeCard.getFieldProps("phone")}
                error={EditeCard.touched?.phone && EditeCard.errors.phone}
                label="Phone"
                type="phone"
                placeholder="some phone..."
                name="phone"
                required
              />
              <Input
                {...EditeCard.getFieldProps("email")}
                error={EditeCard.touched?.email && EditeCard.errors.email}
                label="Email"
                type="email"
                placeholder="exmple@email.com"
                name="email"
                required
              />

              <Input
                {...EditeCard.getFieldProps("web")}
                error={EditeCard.touched?.web && EditeCard.errors.web}
                label="Web"
                type="text"
                placeholder="www.bing.com"
                name="web"
              />
              <Input
                {...EditeCard.getFieldProps("image.url")}
                error={
                  EditeCard.touched.image?.url && EditeCard.errors["image.url"]
                }
                label="Url"
                type="text"
                placeholder="www.image.com"
                name="image.url"
              />
              <Input
                {...EditeCard.getFieldProps("image.alt")}
                error={
                  EditeCard.touched.image?.alt && EditeCard.errors["image.alt"]
                }
                label="Alt"
                type="text"
                placeholder="Some Alternative"
                name="image.alt"
              />
            </div>
            <div className="col-md-6">
              <Input
                {...EditeCard.getFieldProps("address.state")}
                error={
                  EditeCard.touched.address?.state &&
                  EditeCard.errors["address.state"]
                }
                label="State"
                type="text"
                placeholder="IL"
                name="address.state"
              />
              <Input
                {...EditeCard.getFieldProps("address.country")}
                error={
                  EditeCard.touched.address?.country &&
                  EditeCard.errors["address.country"]
                }
                label="country"
                type="text"
                placeholder="Israel"
                name="address.country"
                required
              />
              <Input
                {...EditeCard.getFieldProps("address.city")}
                error={
                  EditeCard.touched.address?.city &&
                  EditeCard.errors["address.city"]
                }
                label="City"
                type="text"
                placeholder="Netanya"
                name="address.city"
                required
              />
              <Input
                {...EditeCard.getFieldProps("address.street")}
                error={
                  EditeCard.touched.address?.street &&
                  EditeCard.errors["address.street"]
                }
                label="Street"
                type="text"
                placeholder="Balfur"
                name="address.street"
                required
              />
              <Input
                {...EditeCard.getFieldProps("address.houseNumber")}
                error={
                  EditeCard.touched.address?.houseNumber &&
                  EditeCard.errors["address.houseNumber"]
                }
                label="HouseNumber"
                type="number"
                placeholder="10"
                name="address.houseNumber"
                required
              />
              <Input
                {...EditeCard.getFieldProps("address.zip")}
                error={
                  EditeCard.touched.address?.zip &&
                  EditeCard.errors["address.zip"]
                }
                label="Zip"
                type="number"
                placeholder="1000"
                name="address.zip"
              />
              <button
                disabled={!EditeCard.isValid || EditeCard.isSubmitting}
                type="submit"
                className="btn btn-primary mt-3"
              >
                Update card
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdataCards;
