import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "./App.css";

const addressPattern = /^[A-Za-zÀ-ÿʻʼ' -]+ shahar,\s*[A-Za-zÀ-ÿʻʼ' -]+ tumani,\s*[A-Za-zÀ-ÿʻʼ' -]+ mahallasi$/i;

const schema = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("Ism kiritilishi shart")
    .min(3, "Kamida 3 ta harfdan iborat bo'lishi kerak")
    .max(20, "Maksimum 20 ta harfdan iborat bo'lishi kerak"),
  lastName: yup
    .string()
    .trim()
    .required("Familiya kiritilishi shart")
    .min(5, "Kamida 5 ta harfdan iborat bo'lishi kerak")
    .max(25, "Maksimum 25 ta harfdan iborat bo'lishi kerak"),
  age: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value
    )
    .typeError("Yosh kiriting")
    .required("Yosh kiriting")
    .min(16, "Kamida 16 yosh")
    .max(99, "99 dan katta bo'lmasligi kerak"),
  gender: yup.string().required("Jinsni tanlang"),
  birthDate: yup.string().required("Sana tanlang"),
  phone: yup
    .string()
    .required("Telefon raqam kiriting")
    .matches(/^\+998\d{9}$/, "Masalan: +998901234567"),
  address: yup
    .string()
    .trim()
    .required("Manzilni kiriting")
    .matches(
      addressPattern,
      "Masalan: Toshkent shahar, Chilonzor tumani, Bunyodkor mahallasi"
    ),
  about: yup
    .string()
    .trim()
    .required("Bu maydonni to'ldiring")
    .min(30, "Kamida 30 ta belgi yozing")
    .max(200, "Maksimum 200 ta belgi yozing"),
});

function Field({ id, label, error, children }) {
  const errorId = error ? `${id}-error` : undefined;

  const fieldProps = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": errorId,
  };

  return (
    <div className={`input-box ${error ? "input-box--error" : ""}`}>
      <label htmlFor={id} className={error ? "input-box__label--error" : ""}>
        {label}
        {error && <span className="input-box__required">*</span>}
      </label>

      {children(fieldProps)}

      {error && (
        <p id={errorId} className="input-box__error" role="alert">
          <svg className="input-box__error-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 6v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14" r="0.75" fill="currentColor" />
          </svg>
          <span>{error.message}</span>
        </p>
      )}
    </div>
  );
}

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
  });

  const errorCount = Object.keys(errors).length;

  const onSubmit = (data) => {
    console.log(data);
    alert("Ma'lumot muvaffaqiyatli yuborildi!");
    reset();
  };

  return (
    <div className="app">
      <div className="app__bg">
        <div className="app__orb app__orb--1" />
        <div className="app__orb app__orb--2" />
        <div className="app__orb app__orb--3" />
      </div>

      <div className="container">
        <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <header className="form__header">
            <span className="form__badge">Premium Anketa</span>
            <h1>Anketa Formasi</h1>
            <p className="form__subtitle">
              Ma'lumotlaringizni to'ldiring — biz siz bilan tez orada bog'lanamiz
            </p>
          </header>

          {isSubmitted && errorCount > 0 && (
            <div className="form__error-summary" role="alert">
              <div className="form__error-summary-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <strong>{errorCount} ta xato topildi</strong>
                <p>Iltimos, qizil belgilangan maydonlarni to'g'rilang</p>
              </div>
            </div>
          )}

          <section className="form__section">
            <h2 className="form__section-title">Shaxsiy ma'lumotlar</h2>

            <div className="form__row">
              <Field id="firstName" label="Ism" error={errors.firstName}>
                {(fieldProps) => (
                  <input
                    type="text"
                    placeholder="Ismingiz"
                    {...register("firstName")}
                    {...fieldProps}
                  />
                )}
              </Field>

              <Field id="lastName" label="Familiya" error={errors.lastName}>
                {(fieldProps) => (
                  <input
                    type="text"
                    placeholder="Familiyangiz"
                    {...register("lastName")}
                    {...fieldProps}
                  />
                )}
              </Field>
            </div>

            <div className="form__row">
              <Field id="age" label="Yosh" error={errors.age}>
                {(fieldProps) => (
                  <input
                    type="number"
                    placeholder="Yoshingiz"
                    {...register("age")}
                    {...fieldProps}
                  />
                )}
              </Field>

              <Field id="gender" label="Jinsi" error={errors.gender}>
                {(fieldProps) => (
                  <select
                    {...register("gender")}
                    {...fieldProps}
                  >
                    <option value="">Tanlang</option>
                    <option>Erkak</option>
                    <option>Ayol</option>
                  </select>
                )}
              </Field>
            </div>

            <Field id="birthDate" label="Tug'ilgan sana" error={errors.birthDate}>
              {(fieldProps) => (
                <input
                  type="date"
                  {...register("birthDate")}
                  {...fieldProps}
                />
              )}
            </Field>
          </section>

          <section className="form__section">
            <h2 className="form__section-title">Aloqa ma'lumotlari</h2>

            <Field id="phone" label="Telefon" error={errors.phone}>
              {(fieldProps) => (
                <input
                  type="tel"
                  placeholder="+998901234567"
                  {...register("phone")}
                  {...fieldProps}
                />
              )}
            </Field>

            <Field id="address" label="Manzil" error={errors.address}>
              {(fieldProps) => (
                <input
                  type="text"
                  placeholder="Toshkent shahar, Chilonzor tumani, Bunyodkor mahallasi"
                  {...register("address")}
                  {...fieldProps}
                />
              )}
            </Field>
          </section>

          <section className="form__section">
            <h2 className="form__section-title">Qo'shimcha</h2>

            <Field id="about" label="O'zingiz haqingizda" error={errors.about}>
              {(fieldProps) => (
                <textarea
                  rows="5"
                  placeholder="O'zingiz haqida yozing..."
                  {...register("about")}
                  {...fieldProps}
                />
              )}
            </Field>
          </section>

          <button type="submit" className="form__submit">
            <span>Yuborish</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
