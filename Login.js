import React, { Component } from "react";

class Login extends Component {
  state = {
    name: "",
    password: "",
  };

  componentDidMount() {
    localStorage.removeItem("token");
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  loginRequest = async () => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "post",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          name: this.state.name,
          password: this.state.password,
        }),
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  handleLogin = async () => {
    const response = await this.loginRequest();
    if (response.status === 200) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      this.props.history.push("/");
    } else {
      alert("Invalid Credentials");
    }
  };

  render() {
    const { name, password } = this.state;
    const isEnabled = name.length > 0 && password.length > 0;
    return (
      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          name="name"
          placeholder="username"
          value={name}
          onChange={this.handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={this.handleChange}
        />
        <button disabled={!isEnabled} onClick={this.handleLogin}>
          Login
        </button>
      </div>
    );
  }
}

export default Login;
