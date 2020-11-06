import { Draggable } from './../Models/DragAndDrop.js';
import { Project } from './../Models/Project.js';
import { Component } from "./Component.js"

// Each Item
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project

    get numOfPeople() {
        if (this.project.people === 1)
            return '1 person'
        else
            return `${this.project.people} people`
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id)
        this.project = project

        this.configure()
        this.renderContent()
    }

    dragStartHandler = (event: DragEvent) => {
        event.dataTransfer!.setData('text/plain', this.project.id)
        event.dataTransfer!.effectAllowed = 'move'
    }
    dragEndHandler = (event: DragEvent) => {
        console.log('drag end')
    }

    configure = () => {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent = () => {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.numOfPeople + ' assigned'
        this.element.querySelector('p')!.textContent = this.project.description
    }
}