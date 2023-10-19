# Portal

## Custom Blender Models

## Importing Custom model

## Optimizing the scene

## Adding particles and other patters

``` javascript

```

1. Disjoint all objects with `F3` -> make singel object and data
We can do this individually after selecting the object with `P`

2. Before doing uv unwrapping or exporting the model we must see if the textures are correctly turned, otherwise we have to flip them.

3. Top right corner, two balls, enable `Face Orientation` filter.

4. Next we must select everything, control A and stabilize the scale, only now can we start unwrapping:

* `A` + `A` -> `Scale`

6. When unwrapping we can say where we are going to start opening the geometry with:

* `U` -> `Mark Seam`

7. To move the unwrapp on the island we can select any part of the object, press `Control` + `L`, and now we can organize the geometry in the wrap

8. After unwrapping everything, it is better to separate each object to improve mipmaping, add margin after unwrapping

9. Apply filmic filter to the Baked image, 