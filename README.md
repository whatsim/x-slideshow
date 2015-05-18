Playing around with Custom elements to learn how they tick. A mostly functional not too terrible photo slideshow el, that needs shadowdom and register element to work.

x-slideshow have an index property that will update the slideshow, or next/previous methods that will iterate index for you. Index will reset to be within bounds if given an out of range value. Setting slide-size on the x-slideshow should update the slideshow and size images to fit. Should allow any valid CSS width? Maybe?

Just include...

```javascript
	<script type="text/javascript" src="scripts/x-slideshow.js"></script>
```

...on the page, and then use the x-slideshow el like...

```html
	<x-slideshow id="slideshow" slide-width="100%" slide-height="600px" src="assets/85250036.JPG, assets/85250035.JPG, assets/6294_24.jpg" index="2"></x-slideshow>
```

...and hopefully it will work.