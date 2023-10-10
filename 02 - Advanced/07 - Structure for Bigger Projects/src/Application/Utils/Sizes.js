import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter
{
    constructor()
    {
        super() // Needed for event emitter override the constructor

        // Setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Resize
        window.addEventListener('resize', () =>
        {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.max(window.devicePixelRatio, 2)

            this.trigger('resize')  // Trigger 'resize' when the event occur
        })
    }
}