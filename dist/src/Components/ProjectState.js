"use strict";
// Store all projects
class ProjectState extends State {
    constructor() {
        super();
        // maintain all projects
        this.projects = [];
        this.updateListeners = () => {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        };
        this.addProject = (title, description, people) => {
            console.log('inside add project');
            const newProject = new Project(Math.random().toString(), title, description, people, projectStatus.active);
            this.projects.push(newProject);
            this.updateListeners();
        };
        this.changeProjectStatus = (projectId, newStatus) => {
            const project = this.projects.find(prj => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        };
    }
}
