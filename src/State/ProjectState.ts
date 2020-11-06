import { projectStatus } from './../Models/Project.js';
import { Project } from '../Models/Project.js'
projectStatus

type Listener<T> = (items: T[]) => void

class State<T> {
    protected listeners: Listener<T>[] = []

    addListener = (listenerFn: Listener<T>) => {
        this.listeners.push(listenerFn)
        console.log('inside add listener')
    }
}

// Store all projects
export class ProjectState extends State<Project>{
    // maintain all projects
    private projects: Project[] = []

    constructor() {
        super()
    }

    private updateListeners = () => {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
    }

    addProject = (title: string, description: string, people: number) => {
        console.log('inside add project')
        const newProject = new Project(Math.random().toString(), title, description, people, projectStatus.active)
        this.projects.push(newProject)
        this.updateListeners()
    }

    changeProjectStatus = (projectId: string, newStatus: projectStatus) => {
        const project = this.projects.find(prj => prj.id === projectId)
        if (project && project.status !== newStatus) {
            project.status = newStatus
            this.updateListeners()
        }
    }
}

export const projectState = new ProjectState
