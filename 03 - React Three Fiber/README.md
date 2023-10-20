# Three.js -  React Three Fiber

React - Data binding- application react to the data (event triggering)



* [Three.js Docs](https://threejs.org/docs/)

1. React
2. React Three Fiber
3. Debug
4. Environment and Staging
5. Load Models
6. 3D Text
7. Portal Scene
8. Mouse Events
9. Post-processing
10. Computer Scene
11. Physics
12. Simple Game


------

# 1 - React

We need to create a physical world and associate it with the THREE.js world

### 3D Physics Libraries
1. [Ammo.js](https://github.com/kripken/ammo.js)
2. [Cannon.js](https://github.com/schteppe/cannon.js?files=1)
3. [Oimo.js](https://github.com/lo-th/Oimo.js/)
4. [Rapier](https://github.com/dimforge/rapier)

### 2D Physics Libraries
1. [Matter.js](https://github.com/liabru/matter-js)
2. [P2.js](https://github.com/schteppe/p2.js)
3. [Planck.js](https://github.com/shakiba/planck.js)
4. [Box2D.js](https://github.com/kripken/box2d.js/)
5. [Rapier](https://github.com/dimforge/rapier)

Cannon.js example

``` bash
npm install --save cannon
```

``` javascript

```

### Apply Forces

* applyForce           Apply force from a specified point in space
* applyImpulse         Apply force to the velocity instead of the force
* applyLocalForce      Apply force in a specific coordinate
* applyLocalImpulse    Same as applyImpulse in a specific coordinate

