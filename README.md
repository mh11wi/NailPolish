# NailPolish
An application to track a collection of nail polishes and showcase nail art.

See my own collection at [https://mh11wi.github.io/NailPolish/](https://mh11wi.github.io/NailPolish/).


## Getting Started

### Configuration
Several envars can be modified to customize the application. These are set in the `.env` file, and include
- `VUE_APP_TITLE`: the title of the application shown in the browser's tab
- `VUE_APP_COLLECTOR`: the name of the collector shown in the navbar
- `VUE_APP_EXTENSION`: the file extension expected of all image files (default: .jpg)
- `VUE_APP_PRIMARY_COLOR`: the primary color of the application; any of the Bootstrap-Vue color variants can be set, namely: `blue`, `indigo`, `purple`, `pink`, `red`, `orange`, `yellow`, `green`, `teal`, or `cyan`

### Installing the application and dependencies
Clone this repository and in the command line enter `npm install` in its directory.

### Running the application
From the command line enter `npm run serve` in the repository's directory. The application will be available at `localhost:8080` by default once compiled.

Note that when adding new images, this command will need to be rerun.


## Adding Content to the Application

### Adding a new polish
The place store information about a nail polish is `src/data/polishes.json`. Note that 2 polishes are prepopulated in this file for Glossy Top Coat and Matte Top Coat. Each polish must have the following attributes
- **id**: a unique number to identify the polish
- **name**: the name of the polish
- **brand**: the brand of the polish
- **type**: the type or special effect of the polish
- **colorFamily**: the rough color of the polish for grouping
- **color**: a broader description of the polish
- **numCoats**: the number of coats applied in the image of the polish
- **collection**: optional, if the polish is part of a collection

Here is an example polish json:
```
{
  "id": "3",
  "name": "One Coat Black",
  "brand": "Holo Taco",
  "type": "Creme",
  "colorFamily": "Black",
  "color": "Very opaque black",
  "numCoats": "1",
  "collection": "Launch Collection (2019)"
}
```

After logging a polish it is time to add images. All polish images are to be stored in the `src/assets/images/polishes` folder. Each polish (except for toppers) should have its own subfolder named after its id. For example, images associated with polish 3 should be located in the `src/assets/images/polishes/3` subfolder. 

It is expected that each subfolder will minimally contain 2 images: one of the polish with a glossy top coat, and one of the polish with a matte top coat. These images should be named `1` and `2` respectively, and be of the file extension configured by `VUE_APP_EXTENSION`.

If a polish is of type "Solar" its subfolder should contain 2 additional images: one of the polish in the sun with a glossy top coat, and one of the polish in the sun with a matte top coat. These images should be named `1-sun` and `2-sun` respectively (plus the noted file extension).

### Adding a new topper
Toppers are a special type of polish whose type must be "Topper". In the application they are not displayed in the Browse Collection view, but rather in the Top It Off view when mapped to another polish. 

After logging a topper in `polishes.json` (as above), it can be mapped to a base polish in the `src/data/toppersMap.json` file. For example, if you have images of polish 3 with toppers 4 and 5 over it, they would be mapped like

```
"3": ["4", "5"]
```

Unlike regular polishes, topper images will not exist in their own subfolder in `src/assets/images/polishes`, but rather in the subfolder of the associated base polish. Continuing our example, images of toppers 4 and 5, should be placed in the `src/assets/images/polishes/3` subfolder with names `4` and `5` respectively (plus the noted file extension).

While it is not yet implemented, images of solar polishes with a topper should follow the same naming convention (i.e. `topperId-sun`).

### Adding a new nail art entry
The place to store information about nail designs is `src/data/nailArt.json`. Each entry must have the following attributes
- **id**: a unique number to identify the entry
- **date**: the date the design was created
- **alt**: a brief description for the image tag's alt attribute
- **description**: a broader description of the design
- **polishes**: an array of polishes used to create the design (either logged in `polishes.json` or not)

For example, if for a nail art design you used three polishes: one that you have logged already with id 3, one topper with id 4 over that polish, and one that you have not logged yet, the json would be like:

```
{
  "id": "1",
  "date": "January 1, 2020",
  "alt": "Nail art",
  "description": "A nail art design",
  "polishes": [
    {"id": "3"},
    {"id": "4", "base": "3"},
    {"brand": "Some Brand", "name": "Some Name"}
  ]
}
```

Notes:
- If the polish is logged, the glossy image of the polish will display in the Nail Art Gallery view in a popover (unless the polish is a topper)
- If the logged polish is a topper, the image of the topper over a specified `base` polish will be displayed in the popover instead

Nail art images are stored directly in the `src/assets/images/nailart` folder. These images should be named after the id specified in `nailArt.json`. For example, if you have a design with id 1, the image should be named `1` and be of the file extension configured by `VUE_APP_EXTENSION`.