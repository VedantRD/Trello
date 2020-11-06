"use strict";
// Project List
class ProjectList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.dragOverHandler = (event) => {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.element.querySelector('ul');
                listEl.classList.add('droppable');
            }
        };
        this.dropHandler = (event) => {
            const prjId = event.dataTransfer.getData('text/plain');
            projectState.changeProjectStatus(prjId, this.type === 'active' ? projectStatus.active : projectStatus.finished);
            console.log(prjId);
        };
        this.dragLeaveHandler = (event) => {
            const listEl = this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        };
        this.renderProjects = () => {
            const listEl = document.getElementById(`${this.type}-projects-list`);
            listEl.innerHTML = '';
            for (const prjItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul').id, prjItem);
            }
        };
        this.configure = () => {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);
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
