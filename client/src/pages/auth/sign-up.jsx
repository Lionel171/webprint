import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
  Textarea,
  Alert,

} from "@material-tailwind/react";
import { AuthContext } from "@/context";
import { useContext, useState } from "react";
import AuthService from "@/services/auth-service";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
}

export function SignUp() {
  const authContext = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    contact_person: "",
    phone: "",
    address: "",
    reseller_id: "",
    password: "",
    agree: false,
  });
  const [isMessage, setIsMessage] = useState(false);

  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    contactPersonError: false,
    phoneError: false,
    addressError: false,
    resellerIdError: false,
    passwordError: false,
    agreeError: false,
    error: false,
    errorText: "",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsMessage(false);

  };

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
    if (e.target.value) {
      setErrors({
        ...errors,
        [e.target.name + 'Error']: false
      })
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    //authContext.login("response.access_token, response.refresh_token");
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true, errorText: " Please provide a company name."});
      return;
    }

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true, errorText: "  Invalid email address" });
      return;
    }

    if (inputs.contact_person.trim().length === 0) {
      setErrors({ ...errors, contactPersonError: true, });
      return;
    }

    if (inputs.phone.trim().length === 0 || !/^\d+$/.test(inputs.phone.trim())) {
      setErrors({ ...errors, phoneError: true, errorText: "Please provide a valid phone number." });
      return;
    }


    if (inputs.address.trim().length === 0) {
      setErrors({ ...errors, addressError: true, errorText: "Please provide a address."});
      return;
    }

    if (inputs.reseller_id.trim().length === 0) {
      setErrors({ ...errors, resellerIdError: true, errorText: "Please provide a reseller ID" });
      return;
    }


    if (inputs.password.trim().length < 8) {
      setErrors({ ...errors, passwordError: true, errorText: " Password must be at least 8 characters long" });
      return;
    }


    if (inputs.agree === false) {
      setErrors({ ...errors, agreeError: true, errorText: "You must agree to the terms and conditions" });
      return;
    }

    // here will be the post action to add a user to the db
    const newUser = {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
      company_name: inputs.name,
      contact_person: inputs.contact_person,
      phone: inputs.phone,
      address: inputs.address,
      reseller_id: inputs.reseller_id,
    };

    const myData = {
      data: {
        type: "users",
        attributes: { ...newUser, password_confirmation: newUser.password },
        relationships: {
          roles: {
            data: [
              {
                type: "roles",
                id: "1",
              },
            ],
          },
        },
      },
    };
    try {
      console.log("response")
      const response = await AuthService.register(myData);


      // authContext.login(response.access_token, response.user.role);
      setIsMessage(true);

      setInputs({
        name: "",
        email: "",
        contact_person: "",
        phone: "",
        address: "",
        reseller_id: "",
        password: "",
        agree: false,
      });

      setErrors({
        nameError: false,
        emailError: false,
        contactPersonError: false,
        phoneError: false,
        addressError: false,
        resellerIdError: false,
        passwordError: false,
        agreeError: false,
        error: false,
        errorText: "",
      });
    } catch (err) {
      setErrors({ ...errors, error: true, errorText: err.data['email'] });
    }
  };


  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      {isMessage ? (
        <Alert color="amber" icon={<Icon />}>User registration request is pending.   Please wait for approval.</Alert>
      ) : null}
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />

      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-2 grid h-12 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign Up
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Input label="Company Name" size="lg"
              name="name"
              onChange={changeHandler}
              error={errors.nameError}
              value={inputs.name}
            />
            <Input type="email" label="Email" size="lg"
              name="email"
              onChange={changeHandler}
              error={errors.emailError}
              value={inputs.email}
            />
            <Input label="Contact Person" size="lg"
              name="contact_person"
              onChange={changeHandler}
              error={errors.contactPersonError}
              value={inputs.contact_person}
            />
            <Input label="Phone" size="lg"
              name="phone"
              onChange={changeHandler}
              error={errors.phoneError}
              value={inputs.phone}
            />
            <Input label="Address" size="lg"
              name="address"
              rows={2}
              onChange={changeHandler}
              error={errors.addressError}
              value={inputs.address}
            />
            <Input label="Reseller Id" size="lg"
              name="reseller_id"
              onChange={changeHandler}
              error={errors.resellerIdError}
              value={inputs.reseller_id}
            />
            <Input type="password" label="Password" size="lg"
              name="password"
              value={inputs.password}
              onChange={changeHandler}
              error={errors.passwordError}
            />
            {/* <Input type="password" label="Repeat Password" size="lg"
              name="password_confirmation"
              value={inputs.password}
              onChange={changeHandler}
              error={errors.passwordError}
            /> */}
            <div className="-ml-2.5">
              <Checkbox label="I agree the Terms and Conditions"
                name="agree" id="agree" onChange={changeHandler} />
            </div>
            {/* errror alert */}
            {errors.errorText && (
              <p className="text-red-600/100 warning">*{errors.errorText} !</p>
            )}
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={submitHandler}>
              Sign Up
            </Button>

            <Typography variant="small" className="mt-6 flex justify-center">
              Already have an account?
              <Link to="/auth/sign-in">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
