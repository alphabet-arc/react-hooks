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

  // data is an array of arrays, each sub-array is members of one team
  const groups = (data && data.length > 0 && Array.isArray(data[0]))
    ? data
    : [];

  return (
    <>
      {groups.map((members, tIdx) => {
        if (!members || members.length === 0) return null;
        const techName = members[0].technology_name;
        return (
          <table key={tIdx}>
            <thead>
              <tr>
                <td>{techName}</td>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => {
                const isEditing = edit && editId === member._id;
                return (
                  <tr key={member._id}>
                    <td>{index + 1}</td>
                    {isEditing ? (
                      <>
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
                );
              })}
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
