import { ProjectItem } from './ProjectItem.js';
import { projectState } from './../State/ProjectState.js';
import { DragTarget } from './../Models/DragAndDrop.js';
import { Project } from './../Models/Project.js';
import { projectStatus } from "../Models/Project.js"
import { Component } from "./Component.js"

// Project List
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: any[] = []

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)

        this.configure()
        this.renderContent()
    }

    dragOverHandler = (event: DragEvent) => {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault()
            const listEl = this.element.querySelector('ul')!
            listEl.classList.add('droppable')
        }
    }
    dropHandler = (event: DragEvent) => {
        const prjId = event.dataTransfer!.getData('text/plain')
        projectState.changeProjectStatus(
            prjId,
            this.type === 'active' ? projectStatus.active : projectStatus.finished
        )
        console.log(prjId)
    }

    dragLeaveHandler = (event: DragEvent) => {
        const listEl = this.element.querySelector('ul')!
        listEl.classList.remove('droppable')
    }

    private renderProjects = () => {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
        }
    }
    configure = () => {
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)

        // add new listener in ProjectState listeners
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === projectStatus.active
                }
                return prj.status === projectStatus.finished
            })
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
    }

    renderContent = () => {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`
    }
}