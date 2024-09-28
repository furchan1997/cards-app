// מייבאים את שירות ה-HTTP לשימוש בפונקציות
import httpService from "./httpService";

// פונקציה ליצירת כרטיס חדש
export function createCard(card) {
  // שולחים בקשה לשרת כדי ליצור כרטיס חדש
  return httpService.post("/cards", card);
}

// פונקציה לקבלת כל הכרטיסים
export function getAll() {
  // שולחים בקשה לשרת כדי לקבל את כל הכרטיסים
  return httpService.get("/cards");
}

// פונקציה לקבלת כרטיס לפי מזהה
export function getCardId(id) {
  // שולחים בקשה לשרת כדי לקבל את הכרטיס לפי המזהה שלו
  return httpService.get(`/cards/${id}`);
}

// פונקציה למחיקת כרטיס לפי מזהה
export function deleteCard(id) {
  // שולחים בקשה לשרת למחוק את הכרטיס לפי המזהה שלו
  return httpService.delete(`/cards/${id}`);
}

// פונקציה לעדכון כרטיס קיים
export function updateCard(id, card) {
  // שולחים בקשה לשרת לעדכן את הכרטיס לפי המזהה שלו
  return httpService.put(`/cards/${id}`, card);
}

// פונקציה לקבלת הכרטיסים של המשתמש הנוכחי
export function getMyCards() {
  // שולחים בקשה לשרת לקבלת הכרטיסים של המשתמש הנוכחי
  return httpService.get("/cards/my-cards");
}

// פונקציה להוספת לייק לכרטיס לפי מזהה
export function likeCard(id) {
  // שולחים בקשה לשרת להוסיף לייק לכרטיס לפי המזהה שלו
  return httpService.patch(`/cards/${id}`);
}

// אובייקט שמרכז את כל פעולות הכרטיסים
const cardsService = {
  createCard,
  getAll,
  getCardId,
  deleteCard,
  updateCard,
  getMyCards,
  likeCard,
};

// מייצאים את אובייקט cardsService לשימוש בקבצים אחרים
export default cardsService;
