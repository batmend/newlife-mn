const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: "Имэйл эсвэл нууц үг буруу байна.",
  email_not_confirmed:
    "Имэйл хаягаа баталгаажуулаагүй байна. Ирсэн захидлын холбоос дээр дарна уу. Холбоос хүчингүй болсон бол «Бүртгүүлэх» хэсгээс ижил имэйлээ дахин оруулж шинэ холбоос аваарай.",
  user_already_exists:
    "Энэ имэйлээр бүртгэл аль хэдийн үүссэн байна. Нэвтэрнэ үү, нууц үгээ мартсан бол сэргээнэ үү.",
  email_exists:
    "Энэ имэйлээр бүртгэл аль хэдийн үүссэн байна. Нэвтэрнэ үү, нууц үгээ мартсан бол сэргээнэ үү.",
  email_address_not_authorized:
    "Одоогоор энэ имэйл хаяг руу захидал илгээх боломжгүй байна. Чуулганы админд хандана уу.",
  weak_password: "Нууц үг хэт энгийн байна. Дор хаяж 8 тэмдэгт, үсэг болон тоо хольж оруулна уу.",
  same_password: "Шинэ нууц үг хуучинтайгаа ижил байна.",
  email_address_invalid: "Имэйл хаяг буруу байна.",
  validation_failed: "Оруулсан мэдээлэл буруу байна.",
  signup_disabled: "Шинэ бүртгэл түр хаалттай байна.",
  email_provider_disabled: "Имэйлээр нэвтрэх боломж идэвхгүй байна.",
  over_email_send_rate_limit: "Хэт олон имэйл илгээлээ. Хэсэг хугацааны дараа дахин оролдоно уу.",
  over_request_rate_limit: "Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.",
  session_expired: "Нэвтрэлтийн хугацаа дууссан. Дахин нэвтэрнэ үү.",
  session_not_found: "Нэвтрэлтийн хугацаа дууссан. Дахин нэвтэрнэ үү.",
  reauthentication_needed: "Нууц үгээ солихын өмнө дахин нэвтэрнэ үү.",
};

const GENERIC = "Алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу.";

export function authErrorMessage(error: { code?: string } | null | undefined) {
  return (error?.code && AUTH_MESSAGES[error.code]) || GENERIC;
}

// P0001 is the code of our own RAISE EXCEPTION messages, which are already in Mongolian.
export function dbErrorMessage(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return GENERIC;
  if (error.code === "42501") return "Энэ үйлдлийг хийх эрх танд алга.";
  if (error.code === "P0001" && error.message) return error.message;
  if (error.code === "23514") return "Оруулсан утга шаардлага хангахгүй байна.";
  return GENERIC;
}
