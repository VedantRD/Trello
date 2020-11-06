// base component class
export abstract class Component<T extends HTMLElement, U extends HTMLElement>{
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