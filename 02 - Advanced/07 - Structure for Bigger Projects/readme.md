# Structure for Bigger Projects - Object Oriented

* Modules
* Classes

## 1 -  Classes and Modules

`Robot.js`
``` javascript
export default class Robot
{
    constructor(name, legs)
    {
        this.name = name;
        this.legs = legs;
        console.log(`Robot ${name} created!`)
    }

    sayHi()
    {
        console.log(`Hello! My name is ${this.name}`)
    }
}
```

`FlyingRobot.js`
``` javascript
import Robot from './Robot.js';

export default class FlyingRobot extends Robot
{
    constructor(name, legs) {
        super(name, legs)
        this.canFly = true
    }
    sayHi()
    {
        super.sayHi()
        console.log(`Function overwriten`)
    }

    takeOff() {
        console.log(`Robot ${this.name} is taking off`)
    }

    land() {
        console.log(`Robot ${this.name} is landing`)
    }
}
```

`script.js`
``` javascript
import Robot from './Robot.js';
import FlyingRobot from './FlyingRobot';

const wallE = new Robot('Wall-E', 0)
const ultron = new FlyingRobot('Ultron', 2)
const astroBoy = new FlyingRobot('Astro Boy', 2)
const megaMan = new Robot('Mega-Man', 2)

wallE.sayHi()
megaMan.sayHi()

ultron.sayHi()
ultron.takeOff()
ultron.land()

```

## 2 -  Code Structure

- Application
    - Utils
        - EventEmitter - Returns a string whenever an event is triggered so that it can be accessed by other classes in a simple way
        - Sizes - Handle the size and resize oh the window
        -
    -
    -


``` javascript



```

## 3 -  Usefull Classes
``` javascript



```
