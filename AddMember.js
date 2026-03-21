import React, { Component } from "react";
import Header from "../Components/Header";
import remove from "../icon/close.png";

class AddMember extends Component {
  state = {
    empId: "",
    empName: "",
    teamName: "",
    experience: "",
    newTeam: "",
    createTeam: false,
    deleteTeam: false,
    teams: [],
    errorStmtEmpId: "",
    errorStmtEmpName: "",
    errorStmtExperience: "",
  };

  async componentDidMount() {
    if (this.getLocalStorage()) {
      const teams = await this.handleGetTeam();
      this.setState({ teams });
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

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    if (name === "empId") {
      const self = this;
      self.validateEmpId(value);
    }
    if (name === "empName") {
      const self = this;
      self.validateEmpName(value);
    }
    if (name === "experience") {
      const self = this;
      self.validateExperience(value);
    }
  };

  validateEmpId = (value) => {
    if (!value) {
      this.setState({ errorStmtEmpId: "*Please enter a value" });
    } else if (Number(value) < 100000 || Number(value) > 3000000) {
      this.setState({
        errorStmtEmpId: "*Employee ID is expected between 100000 and 3000000",
      });
    } else {
      this.setState({ errorStmtEmpId: "" });
    }
  };

  validateEmpName = (value) => {
    if (!value) {
      this.setState({ errorStmtEmpName: "*Please enter a value" });
    } else if (!/^[a-zA-Z ]+$/.test(value)) {
      this.setState({
        errorStmtEmpName: "Employee name can have only alphabets and spaces",
      });
    } else if (value.length < 3) {
      this.setState({
        errorStmtEmpName: "Employee Name should have atleast 3 letters",
      });
    } else {
      this.setState({ errorStmtEmpName: "" });
    }
  };

  validateExperience = (value) => {
    if (value === "" || value === undefined || value === null) {
      this.setState({ errorStmtExperience: "*Please enter a value" });
    } else {
      this.setState({ errorStmtExperience: "" });
    }
  };

  AddRequest = async () => {
    try {
      const response = await fetch("/api/tracker/members/add", {
        method: "post",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${this.getLocalStorage()}`,
        },
        body: JSON.stringify({
          employee_id: this.state.empId,
          employee_name: this.state.empName,
          technology_name: this.state.teamName,
          experience: this.state.experience,
        }),
      });
      return response.status;
    } catch (e) {
      console.log(e);
    }
  };

  handleAddMember = async (e) => {
    const status = await this.AddRequest();
    if (status === 201) {
      this.handleClear();
    } else if (status === 400) {
      alert("Member already exist in the team which you are adding");
    }
  };

  handleClear = () => {
    this.setState({
      empId: "",
      empName: "",
      teamName: "",
      experience: "",
      newTeam: "",
      createTeam: false,
      deleteTeam: false,
      errorStmtEmpId: "",
      errorStmtEmpName: "",
      errorStmtExperience: "",
    });
  };

  handleAddOrDeleteTeam = (e, action) => {
    if (action === "add") {
      this.setState({ createTeam: true, deleteTeam: false });
    } else {
      this.setState({ deleteTeam: true, createTeam: false });
    }
  };

  handleCancel = (e, action) => {
    if (action === "add") {
      this.setState({ createTeam: false, newTeam: "" });
    } else {
      this.setState({ deleteTeam: false });
    }
  };

  saveTeam = async () => {
    try {
      const response = await fetch("/api/tracker/technologies/add", {
        method: "post",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${this.getLocalStorage()}`,
        },
        body: JSON.stringify({ technology_name: this.state.newTeam }),
      });
      return response.status;
    } catch (e) {
      console.log(e);
    }
  };

  handleSave = async (e) => {
    const status = await this.saveTeam();
    if (status === 201) {
      this.setState({ createTeam: false, newTeam: "" });
      const teams = await this.handleGetTeam();
      this.setState({ teams });
    } else {
      alert("Team already exist");
    }
  };

  removeTeamRequest = async (name) => {
    try {
      const response = await fetch(
        `/api/tracker/technologies/remove/${name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.getLocalStorage()}`,
          },
        }
      );
      return response.status;
    } catch (e) {
      console.log(e);
    }
  };

  handleRemoveTeam = async (e, tech) => {
    const status = await this.removeTeamRequest(tech);
    if (status === 200) {
      this.setState({ deleteTeam: false });
      const teams = await this.handleGetTeam();
      this.setState({ teams });
    } else {
      alert("Couldn't delete the team");
    }
  };

  render() {
    const {
      empId, empName, teamName, experience, newTeam,
      createTeam, deleteTeam, teams,
      errorStmtEmpId, errorStmtEmpName, errorStmtExperience,
    } = this.state;

    const isAddEnabled =
      empId !== "" && empName !== "" && teamName !== "" && experience !== "" &&
      errorStmtEmpId === "" && errorStmtEmpName === "" && errorStmtExperience === "";

    return (
      <>
        <Header />
        <form>
          <h1>Add Team Member</h1>
          <div>
            <input
              type="number" name="empId" placeholder="Employee ID"
              value={empId} onChange={this.handleChange}
            />
            <span>{errorStmtEmpId}</span>

            <input
              type="text" name="empName" placeholder="Employee Name"
              value={empName} onChange={this.handleChange}
            />
            <span>{errorStmtEmpName}</span>

            <select name="teamName" value={teamName} onChange={this.handleChange}>
              <option value="">--Select Team--</option>
              {teams.map((t) => (
                <option key={t._id} value={t.name}>{t.name}</option>
              ))}
            </select>

            <button type="button" onClick={(e) => this.handleAddOrDeleteTeam(e, "add")}>+</button>
            <button type="button" onClick={(e) => this.handleAddOrDeleteTeam(e, "delete")}>Delete</button>

            {createTeam && (
              <div className="addList">
                <p>Create New Label</p>
                <input type="text" name="newTeam" value={newTeam} onChange={this.handleChange} />
                <button type="button" onClick={this.handleSave}>Save</button>
                <button type="button" onClick={(e) => this.handleCancel(e, "add")}>Cancel</button>
              </div>
            )}

            {deleteTeam && (
              <div className="addList">
                <p>Delete Team</p>
                <table>
                  <tbody>
                    {teams.map((t) => (
                      <tr key={t._id}>
                        <td>{t.name}</td>
                        <td>
                          <img src={remove} alt="x"
                            onClick={(e) => this.handleRemoveTeam(e, t.name)} />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <button type="button" onClick={(e) => this.handleCancel(e, "delete")}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <input
              type="number" name="experience" placeholder="Experience"
              value={experience} onChange={this.handleChange}
            />
            <span>{errorStmtExperience}</span>
          </div>

          <div>
            <button className="button" type="button"
              disabled={!isAddEnabled} onClick={this.handleAddMember}>Add</button>
            <button className="button" type="button" onClick={this.handleClear}>Clear</button>
          </div>
        </form>
      </>
    );
  }
}

export default AddMember;
