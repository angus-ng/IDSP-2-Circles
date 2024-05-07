import HttpException from "./HttpException";

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, "The Credentials are incorrect");
  }
}

export default WrongCredentialsException;
