# Portal

## Custom Blender Models

## Importng Custom model

## Optimizing the scene

## Adding particles and other patters

``` javascript

```

Disjoint all objects with `F3` -> make singel object and data
We can do this individually after selecting the object with `P`

Before doing uv unwrapping or exporting the model we must see if the textures are correctly turned, otherwise we have to flip them.

Top right corner, two balls, enable `Face Orientation` filter.

Next we must select everything, control A and stabilize the scale, only now can we start unwrapping:

* `A` + `A` -> `Scale`

When unwrapping we can say where we are going to start opening the geometry with:

* `U` -> `Mark Seam`

To move the unwrapp on the island we can select any part of the object, press `Control` + `L`, and now we can organize the geometry in the wrap

After unwrapping everything, it is better to separate each object to improve mipmaping, add margin after unwrapping