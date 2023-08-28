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
  Alert,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { AuthContext } from "@/context";
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


export function SignIn() {

  const authContext = useContext(AuthContext);
  const [isMessage, setIsMessage] = useState(false);


  const [inputs, setInputs] = useState({
    email: "",
    phone: "",
    agree: false,
  });

  const [errors, setErrors] = useState({
    emailError: false,
    phoneError: false,
    agreeError: false,
    error: false,
    errorText: "",
  });
  const submitHandler = async (e) => {
    e.preventDefault();

    //authContext.login("response.access_token, response.refresh_token");
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true, errorText: "  Invalid email address" });
      return;
    }

    if (inputs.password.trim().length < 8) {
      setErrors({ ...errors, passwordError: true, errorText: " Password must be at least 8 characters long" });
      return;
    }


    // if (inputs.agree === false) {
    //   setErrors({ ...errors, agreeError: true });
    //   console.log("agree false");
    //   return;
    // }

    // here will be the post action to add a user to the db
    const newUser = { email: inputs.email, password: inputs.password };
    console.log(newUser)
    // const myData = {
    //   data: {
    //     type: "users",
    //     attributes: { ...newUser },
    //     relationships: {
    //       roles: {
    //         data: [
    //           {
    //             type: "roles",
    //             id: "1",
    //           },
    //         ],
    //       },
    //     },
    //   },
    // };
    try {
      const response = await AuthService.login(newUser);
      if (response.user.user_status === "permit") {
        authContext.login(response.accessToken, response.user.role, response.user.contact_person, response.user.email, response.user._id);
      } else {
        setIsMessage(true);
      }


      setInputs({
        email: "",
        password: "",
        agree: false,
      });

      setErrors({
        emailError: false,
        passwordError: false,
        agreeError: false,
        error: false,
        errorText: "",
      });
    } catch (err) {
      setErrors({ ...errors, error: true, errorText: "Email or password is incorrect" });
    }
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

  const agreeHandler = (e) => {
    console.log(e.target.value);
  }
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
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input type="email" label="Email" size="lg"
              name="email"
              onChange={changeHandler}
              error={errors.emailError}
              value={inputs.email}
            />
            <Input type="password" label="Password" size="lg"
              name="password"
              value={inputs.password}
              onChange={changeHandler}
              error={errors.passwordError}
            />
            <div className="-ml-2.5">
              <Checkbox label="Remember Me" onChange={agreeHandler} />
            </div>
            {/* errror alert */}
            {errors.errorText && (
              <p className="text-red-600/100 warning">*{errors.errorText} !</p>
            )}
          </CardBody>

          <CardFooter className="pt-0">
            <Button variant="gradient" fullWidth onClick={submitHandler}>
              Sign In
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Don't have an account?
              <Link to="/auth/sign-up">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
