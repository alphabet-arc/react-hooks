import React, { Component } from "react";
import Header from "../Components/Header";

class MoveMember extends Component {
  state = {
    teams: [],
    data: [],
    empId: "",
    errorStmtEmpId: "",
    from: "",
    to: "",
  };

  async componentDidMount() {
    if (this.getLocalStorage()) {
      const teams = await this.handleGetTeam();
      this.setState({ teams });
      const data = await this.handleGetMembers("/api/tracker/members/display");
      if (data) this.setState({ data });
    } else {
      if (this.props.history) this.props.history.push("/login");
    }
  }

  getLocalStorage = () => {
    return localStorage.getItem("token");
  };

  handleGetTeam = async () => {
    try {
      const response = await fetch("/api/tracker/technologies/get", {
        headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
      });
      const teams = await response.json();
      return teams;
    } catch (e) {
      console.log(e);
    }
  };

  handleGetMembers = async (url) => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (name === "empId") {
      if (!value) {
        this.setState({ errorStmtEmpId: "*Please enter a value" });
      } else if (Number(value) < 100000 || Number(value) > 3000000) {
        this.setState({ errorStmtEmpId: "*Employee ID is expected between 100000 and 3000000" });
      } else {
        this.setState({ errorStmtEmpId: "" });
      }
    }
  };

  handleClear = () => {
    this.setState({ empId: "", from: "", to: "", errorStmtEmpId: "" });
  };

  MoveRequest = async (id) => {
    try {
      const response = await fetch(`/api/tracker/members/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${this.getLocalStorage()}`,
        },
        body: JSON.stringify({
          technology_name: this.state.to,
        }),
      });
      return response.status;
    } catch (e) {
      console.log(e);
    }
  };

  handleMove = async (e) => {
    const member = this.state.data.find((m) => m.employee_id === Number(this.state.empId));
    const id = member ? member._id : this.state.empId;
    const status = await this.MoveRequest(id);
    if (status === 200) {
      this.handleClear();
      const data = await this.handleGetMembers("/api/tracker/members/display");
      if (data) this.setState({ data });
    }
  };

  render() {
    const { teams, empId, from, to, errorStmtEmpId } = this.state;

    const isMoveEnabled =
      empId !== "" && from !== "" && to !== "" && errorStmtEmpId === "";

    return (
      <>
        <Header />
        <form className="MoveMember">
          <h1>Move Team Member</h1>
          <input
            className="MoveMember" type="text" name="empId"
            placeholder="Employee ID" value={empId} onChange={this.handleChange}
          />
          <span>{errorStmtEmpId}</span>

          <div className="fromTo">
            <label>From</label>
            <select name="from" value={from} onChange={this.handleChange}>
              <option value="">--Select Team--</option>
              {teams.map((t) => (
                <option key={t._id} value={t.name}>{t.name}</option>
              ))}
            </select>

            <label>To</label>
            <select name="to" value={to} onChange={this.handleChange}>
              <option value="">--Select Team--</option>
              {teams.map((t) => (
                <option key={t._id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="row3">
            <button className="add" type="button"
              disabled={!isMoveEnabled} onClick={(e) => this.handleMove(e)}>Move</button>
            <button className="add" type="button"
              onClick={() => this.handleClear()}>Clear</button>
          </div>
        </form>
      </>
    );
  }
}

export default MoveMember;
