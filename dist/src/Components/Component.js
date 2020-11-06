// base component class
export class Component {
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
