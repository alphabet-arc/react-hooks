import React from "react";

export function Teams(props) {
  const {
    data,
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

  // data is an array of arrays - each sub-array is members of one team
  const groups = Array.isArray(data) && data.length > 0 && Array.isArray(data[0])
    ? data
    : [];

  return (
    <>
      {groups.map((group, groupIndex) => {
        if (!group || group.length === 0) return null;
        const techName = group[0].technology_name;
        return (
          <table key={techName || groupIndex}>
            <thead>
              <tr>
                <td>{techName}</td>
              </tr>
            </thead>
            <tbody>
              {group.map((member, index) => (
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
