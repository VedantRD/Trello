import { projectState } from './../State/ProjectState.js';
import { Component } from "./Component.js"

// Taking Project Input
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    // form elements
    titleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement

    constructor() {
        super('project-input', 'app', true, 'user-input')

        // reference to form inputs
        this.titleInputElement = document.querySelector('#title') as HTMLInputElement
        this.descriptionInputElement = document.querySelector('#description') as HTMLInputElement
        this.peopleInputElement = document.querySelector('#people') as HTMLInputElement

        // add event listener to the form
        this.configure()
    }

    configure = () => {
        // attach submit listener
        this.element.addEventListener('submit', this.submitHandler)
    }

    // handle form submit action
    private submitHandler = (event: Event) => {
        event.preventDefault()
        const title = this.titleInputElement.value
        const description = this.descriptionInputElement.value
        const people = this.peopleInputElement.value
        if (this.validateInput(title, description, people)) {
            console.log(title, description, +people)
            projectState.addProject(title, description, +people)
            this.clearInputs()
        }
    }

    private clearInputs() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    private validateInput = (title: string, description: string, people: string) => {
        if (title.trim().length === 0 || description.trim().length === 0 || people.trim().length === 0) {
            alert('All fields are mandatory!!')
            return false
        }
        else if (+people < 1) {
            alert('Atleast one persone should be assigned for the task!!')
            return false
        }
        return true
    }

    renderContent = () => { }
}