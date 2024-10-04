# OpenFOAM cartographer

This is a PoC to produce map-like visualizations of OpenFOAM classes
without the need of OpenFOAM environments and heavy constructions of
objects with complex dependencies.

The goal is:
- To create a visual-programming interface for OpenFOAM-like models,
  where users are presented with class members, their types and their
  default values if possible
- Users can change member values and there should be a visual feedback
  on whether the entered data will result in a valid OpenFOAM syntax.

This, of course, heavily relies on a RESTful API generated by
[openfoam-reflections endpoint](https://github.com/FoamScience/openfoam-reflections).

Make sure the endpoint app is running on port 18080 (by default), and then:
```bash
npm i
npm start
```

There is a permanent legend node to get you started.

![2024-10-04_12-25](https://github.com/user-attachments/assets/f3cca36c-b740-429a-9170-f05c4957c51f)
