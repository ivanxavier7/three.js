import * as THREE from 'three'

import Application from "../Application";
import Environment from './Environment';
import Floor from './Floor';

export default class World
{
    constructor()
    {
        this.application = new Application();
        this.scene = this.application.scene
        this.resources = this.application.resources

        // test mesh
        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial()
        )
        this.scene.add(testMesh)

        // Waiting for the resources to load
        this.resources.on('resourcesLoaded', () =>
        {
            // Setup
            this.floor = new Floor()
            this.environment = new Environment()
        })
    }
}