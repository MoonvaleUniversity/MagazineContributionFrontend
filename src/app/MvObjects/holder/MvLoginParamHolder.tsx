export class LoginParamHolder {
    email: string;
    password: string;
    role: string;
  
    constructor(email = "", password = "", role = "") {
      this.email = email;
      this.password = password;
      this.role = role;
    }
  
    toMap() {
      return {
        email: this.email,
        password: this.password,
        role: this.role
      };
    }
  }
  