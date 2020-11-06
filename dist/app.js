"use strict";
var projectStatus;
(function (projectStatus) {
    projectStatus[projectStatus["active"] = 0] = "active";
    projectStatus[projectStatus["finished"] = 1] = "finished";
})(projectStatus || (projectStatus = {}));
// Each Project Structure
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
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
class ProjectState extends State {
    constructor() {
        super();
        // maintain all projects
        this.projects = [];
        this.addProject = (title, description, people) => {
            console.log('inside add project');
            const newProject = new Project(Math.random().toString(), title, description, people, projectStatus.active);
            this.projects.push(newProject);
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        };
    }
}
const projectState = new ProjectState;
// base component class
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        // adding element to dom
        this.attach = (insertAtStart) => {
            this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
        };
        // reference of template from where to take element
        this.templateElement = document.getElementById(templateId);
        // reference of element where we put that element
        this.hostElement = document.getElementById(hostElementId);
        // take that section
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        // assign new id to that element if got
        if (newElementId) {
            this.element.id = newElementId;
        }
        // attach element to dom
        this.attach(insertAtStart);
    }
}
// Each Item
class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, false, project.id);
        this.configure = () => { };
        this.renderContent = () => {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.numOfPeople + ' assigned';
            this.element.querySelector('p').textContent = this.project.description;
        };
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get numOfPeople() {
        if (this.project.people === 1)
            return '1 person';
        else
            return `${this.project.people} people`;
    }
}
// Project List
class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.renderProjects = () => {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = '';
            for (const prjItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul').id, prjItem);
            }
        };
        this.configure = () => {
            // add new listener in ProjectState listeners
            projectState.addListener((projects) => {
                const relevantProjects = projects.filter(prj => {
                    if (this.type === 'active') {
                        return prj.status === projectStatus.active;
                    }
                    return prj.status === projectStatus.finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        };
        this.renderContent = () => {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector('ul').id = listId;
            this.element.querySelector('h2').textContent = `${this.type.toUpperCase()} PROJECTS`;
        };
        this.configure();
        this.renderContent();
    }
}
// Taking Project Input
class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.configure = () => {
            // attach submit listener
            this.element.addEventListener('submit', this.submitHandler);
        };
        // handle form submit action
        this.submitHandler = (event) => {
            event.preventDefault();
            const title = this.titleInputElement.value;
            const description = this.descriptionInputElement.value;
            const people = this.peopleInputElement.value;
            if (this.validateInput(title, description, people)) {
                console.log(title, description, +people);
                projectState.addProject(title, description, +people);
                this.clearInputs();
            }
        };
        this.validateInput = (title, description, people) => {
            if (title.trim().length === 0 || description.trim().length === 0 || people.trim().length === 0) {
                alert('All fields are mandatory!!');
                return false;
            }
            else if (+people < 1) {
                alert('Atleast one persone should be assigned for the task!!');
                return false;
            }
            return true;
        };
        this.renderContent = () => { };
        // reference to form inputs
        this.titleInputElement = document.querySelector('#title');
        this.descriptionInputElement = document.querySelector('#description');
        this.peopleInputElement = document.querySelector('#people');
        // add event listener to the form
        this.configure();
    }
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
}
const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
