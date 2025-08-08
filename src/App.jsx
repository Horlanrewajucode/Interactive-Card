import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    month: "",
    year: "",
    cvc: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate(name, value) {
    if (name === "name") {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return "Name must contain only letters";
      }
    } else if (name === "cardNumber") {
      if (!/^\d{16}$/.test(value.replace(/\s/g, ""))) {
        return "Card number must be 16 digits";
      }
    } else if (name === "month") {
      if (!/^(0?[1-9]|1[0-2])$/.test(value)) {
        return "Enter valid month (01 - 12)";
      }
    } else if (name === "year") {
      if (!/^\d{2}$/.test(value)) {
        return "Enter a valid 2-digit year";
      }
    } else if (name === "cvc") {
      if (!/^\d{3}$/.test(value)) {
        return "CVC must be 3 digits";
      }
    }

    return "";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "cardNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      formattedValue = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    const error = validate(name, formattedValue.replace(/\s/g, ""));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  }

  function isFormValid() {
    return (
      formData.name &&
      formData.cardNumber &&
      formData.month &&
      formData.year &&
      formData.cvc &&
      Object.values(errors).every((err) => !err)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    for (const field in formData) {
      const error = validate(field, formData[field]);
      if (error) newErrors[field] = error;
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <>
      <div className="flex items-center">
        <div className="md:bg-[url('/bg-main-desktop.png')] bg-no-repeat h-[100%] w-full bg-contain bg-[url('/bg-main-mobile.png')]">
          <BackCard formData={formData} />
          <FrontCard formData={formData} />
        </div>
        <Form
          formData={formData}
          errors={errors}
          onHandleChange={handleChange}
          onSubmit={handleSubmit}
          submitted={submitted}
          isFormValid={isFormValid}
        />
      </div>
    </>
  );
}

function FrontCard({ formData }) {
  return (
    <div className="bg-[url('./bg-card-front.png')] bg-no-repeat h-screen w-full relative top-110 left-80">
      <div className="flex items-center gap-4 relative top-6 left-6">
        <div className="h-10 w-10 bg-white rounded-full"></div>
        <div className="h-4 w-4 bg-transparent rounded-full border-2 border-white"></div>
      </div>
      <div className=" flex flex-col gap-3 relative left-6 top-20">
        <p className="font-mono text-white text-[35px] ">
          {formData.cardNumber || "0000 0000 0000 0000"}
        </p>
        <div className="flex justify-between items-center w-96 ">
          <p className="text-white">{formData.name || "JANE APPLESEED"}</p>
          <p className="text-white">
            {formData.month || "00"}/{formData.year || "00"}
          </p>
        </div>
      </div>
    </div>
  );
}

function BackCard({ formData }) {
  return (
    <div className="bg-[url('./bg-card-back.png')] bg-no-repeat w-full h-screen absolute top-40 left-60">
      <div className="absolute">
        <p className="text-white text-[16px] relative top-26 left-93">
          {formData.cvc || "000"}
        </p>
      </div>
    </div>
  );
}

function Form({
  formData,
  onHandleChange,
  onSubmit,
  submitted,
  errors,
  isFormValid,
}) {
  return (
    <>
      {!submitted ? (
        <form className="flex flex-col gap-4 h-[400px] w-[500px] relative right-70">
          <div className="flex flex-col font-semibold gap-1 text-[15px]">
            <label>CARDHOLDER NAME</label>
            <input
              type="text"
              placeholder="e.g. Jane Appleseed"
              name="name"
              value={formData.name}
              onChange={onHandleChange}
              className={`border h-12 rounded-[10px] px-4 outline-0 ${
                errors.name ? "border-red-500" : "border-stone-400"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Card Number Field */}
          <div className="flex flex-col font-semibold gap-1 text-[15px]">
            <label>CARD NUMBER</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={onHandleChange}
              maxLength={19}
              className={`border h-12 rounded-[10px] px-4 outline-0 ${
                errors.cardNumber ? "border-red-500" : "border-stone-400"
              }`}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm">{errors.cardNumber}</p>
            )}
          </div>

          {/* Month and Year */}
          <div className="flex items-center justify-center font-semibold text-[15px] gap-4">
            <div>
              <label>EXP. DATE (MM/YY)</label>
              <div className="flex gap-2 my-2">
                <input
                  type="text"
                  placeholder="MM"
                  name="month"
                  value={formData.month}
                  onChange={onHandleChange}
                  maxLength={2}
                  className={`border h-12 rounded-[10px] px-4 w-20 outline-0 ${
                    errors.month ? "border-red-500" : "border-stone-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="YY"
                  name="year"
                  value={formData.year}
                  onChange={onHandleChange}
                  maxLength={2}
                  className={`border h-12 rounded-[10px] px-4 w-20 outline-0 ${
                    errors.year ? "border-red-500" : "border-stone-400"
                  }`}
                />
              </div>
              {errors.month && (
                <p className="text-red-500 text-sm">{errors.month}</p>
              )}
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year}</p>
              )}
            </div>

            {/* CVC */}
            <div className="flex flex-col">
              <label>CVC</label>
              <input
                type="text"
                placeholder="e.g 123"
                name="cvc"
                value={formData.cvc}
                onChange={onHandleChange}
                maxLength={3}
                className={`border h-12 rounded-[10px] px-4 w-50 my-2 outline-0 ${
                  errors.cvc ? "border-red-500" : "border-stone-400"
                }`}
              />
              {errors.cvc && (
                <p className="text-red-500 text-sm">{errors.cvc}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid()}
            onClick={onSubmit}
            className={`${
              isFormValid()
                ? "bg-purple-950"
                : "bg-purple-400 cursor-not-allowed"
            } text-white py-4 rounded-[10px] outline-0 font-semibold text-[20px] cursor-pointer`}
          >
            Confirm
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3  h-[400px] w-[500px] relative right-70">
          <img src="/icon-complete.svg" alt="completed-icon" className="w-20" />
          <h3 className="font-semibold text-[30px] text-purple-900">
            Thank you!!!
          </h3>
          <p className="text-stone-400 text-[20px]">
            We have added your card details
          </p>
          <button className="bg-purple-950 text-white w-full py-4 rounded-[10px] outline-0 font-semibold cursor-pointer text-[20px]">
            Continue
          </button>
        </div>
      )}
    </>
  );
}

export default App;
