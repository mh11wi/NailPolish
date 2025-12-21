# NailPolish
An application to track a collection of nail polishes and showcase nail art.

See my own collection at [https://mh11wi.github.io/NailPolish/](https://mh11wi.github.io/NailPolish/).


## Getting Started

### Configuration
Several envars can be modified to customize the application. These are set in the `.env` file, and include
- `VITE_TITLE`: the title of the application shown in the navbar
- `VITE_DESCRIPTION`: the description of the application shown in the info popover
- `VITE_EXTENSION`: the file extension expected of all image files (default: .jpg)
- `VITE_PRIMARY_COLOR`: the primary color of the application; any HTML color name, hex, or rgb value
- `VITE_PLACEHOLDER_COLOR`: the color of the placeholder tile displayed before an image loads
- `VITE_FINISH_TOGGLE`: whether a switch should be displayed that toggles between glossy and matte images

### Installing the application and dependencies
Clone this repository and in the command line enter `npm install` in its directory.

### Running the application
From the command line enter `npm run serve` in the repository's directory. The application will be available at `localhost:8080` by default once compiled.


## Adding Content

### Adding a new polish
The place store information about a nail polish is `src/data/polishes.json`. Note that 2 polishes are prepopulated in this file for "Glossy Top Coat" and "Matte Top Coat". Each polish must have the following attributes
- **id**: a unique number to identify the polish
- **name**: the name of the polish
- **brand**: the brand of the polish
- **type**: the type or special effect of the polish
- **colorFamily**: the general color of the polish, for grouping
- **color**: a broader description of the polish
- **numCoats**: the number of coats applied in the image of the polish
- **collection**: the collection that the polish is part of (optional)
- **destashed**: a boolean for if the polish has been destashed (optional)
- **suffix**: if the polish is photographed in two states, a string to differentiate the second file (optional)

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

After logging a polish it is time to add images. All polish images should have a 1:1 aspect ratio, and are to be stored in the `src/assets/images/polishes` folder. Each polish (except for toppers) should have its own subfolder named after its id. For example, images associated with polish 3 should be located in the `src/assets/images/polishes/3` subfolder. 

If `VITE_FINISH_TOGGLE=="true"` it is expected that each subfolder will minimally contain 2 images: one of the polish with a glossy top coat, and one of the polish with a matte top coat. These images should be named `1` and `2` respectively, and be of the file extension configured by `VITE_EXTENSION`. It is recommended for these images to be either full hand swatches, single nail swatches, or even photos of a swatch stick. For a better look, try to keep the model consistent in each image.

Otherwise, only one image needs to be included in each subfolder with name `1` (plus the noted file extension). Ideally this would be a swatch of the polish either in its natural state or with a glossy top coat. Bottle shots could also work here, but are not recommended if you plan to add images of the polish with toppers later on.

#### Two-state polish effects
Sometimes it is hard to capture the effect of a polish in a single image, e.g. with solar or glow in the dark polishes. This application can support a second image in this case, but it requires additional logging. Namely, the `suffix` attribute needs to be set for the polish in `polishes.json`. The following suffixes are currently accepted:

| **Polish Type**      | **Suffix**                                    |
|--------------------- |-----------------------------------------------|
| **Solar**            | -sun <br> -uv                                 |
| **Glow in the Dark** | -dark <br> -glow                              |
| **Thermal** \*       | -hot <br> -cold <br> -warm <br> -cool         |
| **Magnetic** \*      | -magnet <br> -velvet <br> -aura <br> -crystal |

\* *only needed if taking multiple photos. You could just dip the tip of your finger in hot/cold water for thermals instead. Likewise, you could apply the cat-eye style for magnetics.*

For example, say you logged a solar polish with `suffix=="-sun"`. In addition to the glossy image of the polish in its natural state (and matte image if configured), the associated subfolder should contain 1 or 2 additional images. Minimally, there needs to be one image of the polish in the sun with a glossy top coat. And, if `VITE_FINISH_TOGGLE=="true"`, there needs to be another image of the polish in the sun with a matte top coat. These images should be named `1-sun` and `2-sun` respectively (plus the noted file extension).

### Adding a new topper
Toppers are a special type of polish whose type must be "Topper". In the application they are not displayed in the Browse Collection view, but rather in the Top It Off view when mapped to another polish. 

After logging a topper in `polishes.json` (as above), it can be mapped to a base polish in the `src/data/toppersMap.json` file. For example, if you have two images of polish 3 with toppers 4 and 5 over it, they would be mapped like

```
"3": ["4", "5"]
```

Unlike regular polishes, topper images will not exist in their own subfolder in `src/assets/images/polishes`, but rather in the subfolder of the associated base polish. Continuing our example, images of toppers 4 and 5 should be placed in the `src/assets/images/polishes/3` subfolder with names `4` and `5` respectively (plus the noted file extension).

If `VITE_FINISH_TOGGLE=="true"` mappings to both id 1 and 2 are implicitly assumed in the application, and do not need to be included in this file. Otherwise, if you want to add an image of a specific polish with a matte top coat, you will need to add an explicit mapping to id `2` like

```
"3": ["2", "4", "5"]
```

Images of a two-state polish with a topper follow the same naming convention based on the `suffix` attribute of the polish (e.g. `topperId-sun` or `topperId-dark`). If the topper itself has two states, give it its own `suffix` attribute but still place the associated images in the subfolder for the base polish.

Please note that if there are no topper mappings, the Top It Off view will not be displayed.

### Adding nail art
Your designs can be showcased in the Nail Art Gallery view of the application by adding entries to `src/data/nailArt.json`. Each entry must have the following attributes
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
- If the logged polish or topper has two states, optionally specify a `suffix` for the desired image like `{"id": "5", "suffix": "-dark"}`

Nail art images are stored directly in the `src/assets/images/nailart` folder. These images should be named after the id specified in `nailArt.json`. For example, if you have a design with id 1, the image should be named `1` and be of the file extension configured by `VITE_EXTENSION`.

Please note that if there are no nail art entries, the Nail Art Gallery view will not be displayed.