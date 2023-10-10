import Application from "../Application.js";
import Environment from './Environment.js';
import Floor from './Floor.js';
import Fox from './Fox.js';

export default class World
{
    constructor()
    {
        this.application = new Application();
        this.scene = this.application.scene
        this.resources = this.application.resources

        // Waiting for the resources to load
        this.resources.on('resourcesLoaded', () =>
        {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.fox)
            this.fox.update()
    }
}