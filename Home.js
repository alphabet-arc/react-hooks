import React, { Component } from "react";
import Header from "../Components/Header";
import Teams from "../Components/Teams";

class Home extends Component {
  state = {
    data: [],
    initialData: [],
    team: [],
    edit: false,
    editId: undefined,
    empId: "",
    empName: "",
    experience: "",
    experienceFilter: "",
    teamName: "",
    checked: "Experience",
  };

  async componentDidMount() {
    if (this.getLocalStorage()) {
      const initialData = await this.handleGetMembers("/api/tracker/members/display");
      if (initialData) this.setState({ initialData });
      const team = await this.handleGetTech();
      if (team) this.setState({ team });
      const data = await this.handleGetMembers("/api/tracker/members/display");
      if (data) this.setState({ data });
    } else {
      if (this.props.history) this.props.history.push("/login");
    }
  }

  getLocalStorage = () => {
    return localStorage.getItem("token");
  };

  handleGetMembers = async (url) => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
      });
      const data = await response.json();
      this.setState({ data, initialData: data });
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  handleGetTech = async () => {
    try {
      const response = await fetch("/api/tracker/technologies/get", {
        headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
      });
      const team = await response.json();
      this.setState({ team });
      return team;
    } catch (e) {
      console.log(e);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChecked = (value) => {
    this.setState({ checked: value, experienceFilter: "", teamName: "" });
  };

  handleDeleteMembers = async (id) => {
    try {
      const response = await fetch(`/api/tracker/members/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${this.getLocalStorage()}` },
      });
      return response.status;
    } catch (e) {
      console.log(e);
    }
  };

  handleDelete = async (e, id) => {
    const status = await this.handleDeleteMembers(id);
    if (status === 200) {
      this.handleGetMembers("/api/tracker/members/display");
    }
  };

  handleEdit = (id) => {
    const member = this.state.initialData.find((m) => m._id === id);
    if (!member) return;
    this.setState({
      edit: true,
      editId: id,
      empId: member.employee_id,
      empName: member.employee_name,
      experience: member.experience,
    });
  };

  handleCancel = () => {
    this.setState({
      edit: false,
      editId: undefined,
      empId: "",
      empName: "",
      experience: "",
    });
  };

  handleEditRequest = async () => {
    try {
      const response = await fetch(
        `/api/tracker/members/update/${this.state.editId}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${this.getLocalStorage()}`,
          },
          body: JSON.stringify({
            employee_id: Number(this.state.empId),
            employee_name: this.state.empName,
            experience: Number(this.state.experience),
          }),
        }
      );
      return response.status;
    } catch (e) {
      console.log(e);
    }
  };

  handleDone = async (e) => {
    const status = await this.handleEditRequest();
    if (status === 200) {
      this.setState({ edit: false, editId: undefined, empId: "", empName: "", experience: "" });
      this.handleGetMembers("/api/tracker/members/display");
    }
  };

  handleClear = async () => {
    this.setState({ experienceFilter: "", teamName: "", checked: "Experience" });
    await this.handleGetMembers("/api/tracker/members/display");
  };

  handleGo = async () => {
    const { checked, experienceFilter, teamName } = this.state;
    let url = "/api/tracker/members/display";
    if (checked === "Experience" && experienceFilter) {
      url += `?experience=${experienceFilter}`;
    } else if (checked === "Team" && teamName) {
      url += `?tech=${teamName}`;
    } else if (checked === "Both" && teamName && experienceFilter) {
      url += `?experience=${experienceFilter}&&tech=${teamName}`;
    }
    await this.handleGetMembers(url);
  };

  render() {
    const {
      data, team, edit, editId, empId, empName, experience,
      experienceFilter, teamName, checked,
    } = this.state;

    let isGoEnabled = false;
    if (checked === "Experience") isGoEnabled = experienceFilter !== "";
    else if (checked === "Team") isGoEnabled = teamName !== "";
    else if (checked === "Both") isGoEnabled = teamName !== "" && experienceFilter !== "";

    return (
      <>
        <Header />
        <section>
          <label>Filter By</label>
          <input type="radio" name="checked" value="Experience"
            checked={checked === "Experience"}
            onChange={() => this.handleChecked("Experience")} />
          <label>Expericence</label>
          <input type="radio" name="checked" value="Team"
            checked={checked === "Team"}
            onChange={() => this.handleChecked("Team")} />
          <label>Team</label>
          <input type="radio" name="checked" value="Both"
            checked={checked === "Both"}
            onChange={() => this.handleChecked("Both")} />
          <label>Both</label>

          {checked === "Team" && (
            <select name="teamName" value={teamName} onChange={this.handleChange}>
              <option value="">--Select Team--</option>
              {team.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
            </select>
          )}

          {checked === "Experience" && (
            <input type="number" name="experienceFilter" placeholder="Experience"
              value={experienceFilter} onChange={this.handleChange} />
          )}

          {checked === "Both" && (
            <>
              <select name="teamName" value={teamName} onChange={this.handleChange}>
                <option value="">--Select Team--</option>
                {team.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
              </select>
              <input type="number" name="experienceFilter" placeholder="Experience"
                value={experienceFilter} onChange={this.handleChange} />
            </>
          )}

          <button disabled={!isGoEnabled} onClick={() => this.handleGo()}>Go</button>
          <button onClick={() => this.handleClear()}>Clear</button>
        </section>

        {team.length === 0 ? (
          <div className="noTeam">No Teams Found</div>
        ) : (
          <Teams
            data={data} team={team} edit={edit} editId={editId}
            empId={empId} empName={empName} experience={experience}
            handleDelete={this.handleDelete}
            handleEdit={(id) => this.handleEdit(id)}
            handleChange={this.handleChange}
            handleCancel={this.handleCancel}
            handleDone={this.handleDone}
          />
        )}
      </>
    );
  }
}

export default Home;
