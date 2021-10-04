# NailPolish
An application to track a collection of nail polishes and showcase nail art.

## Quick Guide

### Data Files

#### src/data/polishes.json
The place store information about a nail polish, including type, color, etc.

```
[
  {
    "id": "unique number for the polish, e.g. 3",
    "name": "the name of the polish, e.g. One Coat Black",
    "brand": "the brand of the polish, e.g. Holo Taco",
    "type": "the type of the polish, e.g. Creme",
    "colorFamily": "the rough color of the polish for grouping, e.g. Black",
    "color": "a broader description of the polish, e.g. Very opaque black",
    "numCoats": "the number of coats applied in the picture, e.g. 1",
    "collection": "optional, if the polish is part of a collection, e.g. Launch Collection (2019)"
  },
  ...
]
```

Notes:
- 2 polishes are prepopulated in this file for Glossy Top Coat and Matte Top Coat
- Toppers are a special type of polish whose type must be "Topper"
- Toppers are not displayed in the Browse Collection view, but rather in the Top It Off view when they are mapped to another polish

#### src/data/toppersMap.json
A mapping of polish id to topper id(s). For example, if you have a picture of polish 3 with toppers 4 and 5 over them, they would be mapped like

```
{
  "3": ["4", "5"],
  ...
}
```

#### src/data/nailArt.json
The place to store information about nail designs, including a description and the polishes used. For example, if for a nail art design you used 2 polishes: one that you have tracked already in `polishes.json` with id 3, and one polish that you have not tracked yet, the json would be like

```
[
  {
    "id": "unique number for the nail art entry",
    "date": "the date the design was created",
    "alt": "a brief description for the image tag's alt attribute",
    "description": "a broader description of the design",
    "polishes": [
      {"id": "3"},
      {"brand": "some brand", "name": "some name"},
      ...
    ]
  },
  ...
]
```

Notes:
- If the polish is tracked, a popover will display in the Nail Art Gallery view with the corresponding glossy image (unless the polish is a topper)
- If the tracked polish is a topper, the popover will the display the image of the topper over the default base polish (configured in `main.js`)

### Image Files

#### src/assets/images/polishes
Polish images (except for toppers) are stored in a folder named after its id. For example, images associated with polish 3 should be located in the `src/assets/images/polishes/3` folder. It is expected that for each tracked polish, the folder will minimally contain 2 images: one with a glossy top coat, and one with a matte top coat. These images should be named `1` and `2` respectively, and be of the file extension configured in `main.js`.

Topper images on the other hand will not exist in their own folder, but rather in the folder of the associated base polish. For example, if you have an image of polish 3 with topper 4, the image should be placed in the `src/assets/images/polishes/3` folder with name `4` (plus the noted file extension).

If a polish is of type "Solar" the folder should contain 2 additional images: one of the polish in the sun with a glossy top coat, and one of the polish in the sun with a matte top coat. These images should be named `1-sun` and `2-sun` respectively (plus the noted file extension). While it is not yet implemented, images of solar polishes with a topper should follow the same naming convention (i.e. `topperId-sun`).

#### src/assets/images/nailart
Nail art images are stored directly in the `src/assets/images/nailart` folder. These images should be named after the id specified in `nailArt.json`. For example, if you have a design with id 1, the image should be named `1` and be of the file extension configured in `main.js`.

### Running the application
1. `npm install` to install the application and dependencies (including vue)
2. `vue ui` to open the vue client
3. Select `NailPolish` projects, then choose the `Tasks` menu
4. Select the `serve` option, then click `Run task`
5. When the project successfully builds click `Open app`

## Customizations

### Webpage Title
The title of the webpage can be modified in the `vue.config.js` file. This will show in a browser's tab.

### Constants
There are a few constants defined in `main.js` that can be modified:
- `base`: the id of the default base polish (it is recommended that whenever adding a new topper to first add an image of it over this polish)
- `name`: the name displayed in the navbar
- `extension`: the file extension expected of all images files (default: .jpg)

### Styling
The primary color of the application can be modified in `src/assets/scss/custom.scss`. Any of the Bootstrap-Vue color variants can be set, namely `blue`, `indigo`, `purple`, `pink`, `red`, `orange`, `yellow`, `green`, `teal`, or `cyan`.