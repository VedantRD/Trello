// to set a project active or not
export enum projectStatus { active, finished }

// Each Project Structure
export class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: projectStatus
    ) { }
}