enum projectStatus { active, finished }

// Each Project Structure
class Project {
    constructor(
        public id: string,
        private title: string,
        private description: string,
        private people: number,
        public status: projectStatus
    ) { }
}

type Listener<T> = (items: T[]) => void

class State<T> {
    protected listeners: Listener<T>[] = []

    addListener = (listenerFn: Listener<T>) => {
        this.listeners.push(listenerFn)
        console.log('inside add listener')
    }
}

// Store all projects
class ProjectState extends State<Project>{
    // maintain all projects
    private projects: Project[] = []

    constructor() {
        super()
    }

    addProject = (title: string, description: string, people: number) => {
        console.log('inside add project')
        const newProject = new Project(Math.random().toString(), title, description, people, projectStatus.active)
        this.projects.push(newProject)
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
    }
}
const projectState = new ProjectState

// base component class
abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U

    constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        // reference of template from where to take element
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement
        // reference of element where we put that element
        this.hostElement = document.getElementById(hostElementId)! as T
        // take that section
        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as U
        // assign new id to that element if got
        if (newElementId) {
            this.element.id = newElementId
        }

        // attach element to dom
        this.attach(insertAtStart)
    }

    // adding element to dom
    private attach = (insertAtStart: boolean) => {
        this.hostElement.insertAdjacentElement(
            insertAtStart ? 'afterbegin' : 'beforeend',
            this.element
        )
    }
    abstract configure?(): void
    abstract renderContent(): void
}

// Project List
class ProjectList extends Component<HTMLDivElement, HTMLElement>{
    assignedProjects: any[] = []

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)

        this.configure()
        this.renderContent()
    }

    private renderProjects = () => {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        listEl.innerHTML = ''
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li')
            listItem.textContent = prjItem.title
            listEl.appendChild(listItem)
        }
    }
    configure = () => {
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

// Taking Project Input
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')