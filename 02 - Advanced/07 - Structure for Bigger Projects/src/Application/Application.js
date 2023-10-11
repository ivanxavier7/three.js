import * as THREE from 'three'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Resources from './Utils/Resources.js'
import Debug from './Utils/Debug.js'

import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'

import sources from "./sources";

let instance = null // singleton, we can instantiate multiple times but we will get the same instance

export default class Application
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        // Global access / Can access all variables and functions in the console
        window.application = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        this.sizes.on('resize', () =>       // Arrow function () => don lose the context (this.something), but function does
        {
            this.resize()
        })

        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy()
    {
        // Remove event listeners
        this.sizes.off('resize')
        this.time.off('tick')
        // Can remove the rest of the eventListener with js (removeEventListener)

        this.scene.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                // Remove object
                child.geometry.dispose()

                // Remove object properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        // Remove camera controls
        this.camera.controls.dispose()

        // Remove renderer
        this.renderer.instance.dispose()

        // Remove debug
        if(this.debug.active)
        {
            this.debug.ui.destroy()
        }
    }
}