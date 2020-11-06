import { projectState } from './../State/ProjectState.js';
import { Component } from "./Component.js";
// Taking Project Input
export class ProjectInput extends Component {
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
