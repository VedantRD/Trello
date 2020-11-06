import { projectStatus } from './../Models/Project.js';
import { Project } from '../Models/Project.js';
projectStatus;
class State {
    constructor() {
        this.listeners = [];
        this.addListener = (listenerFn) => {
            this.listeners.push(listenerFn);
            console.log('inside add listener');
        };
    }
}
// Store all projects
export class ProjectState extends State {
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
export const projectState = new ProjectState;
