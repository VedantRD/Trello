import { Component } from "./Component.js";
// Each Item
export class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, false, project.id);
        this.dragStartHandler = (event) => {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        };
        this.dragEndHandler = (event) => {
            console.log('drag end');
        };
        this.configure = () => {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        };
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
