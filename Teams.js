import React from "react";

export function Teams(props) {
  const {
    data,
    team,
    edit,
    editId,
    empId,
    empName,
    experience,
    handleDelete,
    handleEdit,
    handleChange,
    handleCancel,
    handleDone,
  } = props;

  // Get unique technology names from data, preserving order
  const techNames = [];
  if (data && data.length > 0) {
    data.forEach((m) => {
      if (!techNames.includes(m.technology_name)) {
        techNames.push(m.technology_name);
      }
    });
  } else if (team && team.length > 0) {
    team.forEach((t) => techNames.push(t.name));
  }

  return (
    <>
      {techNames.map((techName) => {
        const members = data ? data.filter((m) => m.technology_name === techName) : [];
        if (members.length === 0) return null;
        return (
          <table key={techName}>
            <thead>
              <tr>
                <td>{techName}</td>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member._id}>
                  {edit && editId === member._id ? (
                    <>
                      <td>{index + 1}</td>
                      <td>
                        <input type="number" name="empId" value={empId} onChange={handleChange} />
                      </td>
                      <td>
                        <input type="text" name="empName" value={empName} onChange={handleChange} />
                      </td>
                      <td>
                        <input type="number" name="experience" value={experience} onChange={handleChange} />
                      </td>
                      <td>
                        <button onClick={handleDone} disabled={empId === "" || empName === "" || experience === ""}>Done</button>
                      </td>
                      <td>
                        <button onClick={handleCancel}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{index + 1}</td>
                      <td>{member.employee_id}</td>
                      <td>{member.employee_name}</td>
                      <td>{member.experience}</td>
                      <td>
                        <button onClick={() => handleEdit(member._id)}>Edit</button>
                      </td>
                      <td>
                        <button onClick={(e) => handleDelete(e, member._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        );
      })}
    </>
  );
}

Teams.defaultProps = {
  data: [],
  team: [],
  edit: false,
  editId: undefined,
  empId: "",
  empName: "",
  experience: "",
  handleDelete: () => {},
  handleEdit: () => {},
  handleChange: () => {},
  handleCancel: () => {},
  handleDone: () => {},
};

export default Teams;
