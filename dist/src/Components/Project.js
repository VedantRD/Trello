// to set a project active or not
export var projectStatus;
(function (projectStatus) {
    projectStatus[projectStatus["active"] = 0] = "active";
    projectStatus[projectStatus["finished"] = 1] = "finished";
})(projectStatus || (projectStatus = {}));
// Each Project Structure
export class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
